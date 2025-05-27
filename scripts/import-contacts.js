import fs from 'fs';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PLUNK_API_KEY = process.env.PLUNK_API_KEY;
const CSV_FILE_PATH = process.env.CSV_FILE_PATH || './contacts.csv';

if (!PLUNK_API_KEY) {
  console.error('Please set PLUNK_API_KEY in your .env file');
  process.exit(1);
}

async function getAllContacts() {
  const response = await fetch('https://api.useplunk.com/v1/contacts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get contacts: ${error.message}`);
  }

  const data = await response.json();
  console.log('API Response:', JSON.stringify(data, null, 2));

  // Handle both possible response structures
  const contacts = Array.isArray(data) ? data : (data.contacts || []);
  return contacts;
}

async function updateContact(email, data) {
  const body = {
    email,
    subscribed: true,
    data
  }
  console.log('Body:', body);
  const response = await fetch(`https://api.useplunk.com/v1/contacts`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update contact: ${error.message}`);
  }

  return response.json();
}

async function createContact(email, data) {
  const response = await fetch('https://api.useplunk.com/v1/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      subscribed: true,
      data
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create contact: ${error.message}`);
  }

  return response.json();
}

async function importContacts() {
  try {
    // Get all existing contacts
    console.log('Fetching existing contacts...');
    const existingContacts = await getAllContacts();
    // console.log(`Raw contacts data:`, existingContacts);

    if (!Array.isArray(existingContacts)) {
      throw new Error('Expected contacts to be an array');
    }

    const contactsByEmail = new Map(existingContacts.map(contact => [contact.email, contact]));
    console.log(`Found ${existingContacts.length} existing contacts`);

    // Read and parse CSV file
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${records.length} contacts to process`);

    // Process each contact
    for (const record of records) {
      try {
        const data = {
          name: record.Name || '',
          first_name: record.Name.split(' ')[0] || '',
          date_subscribed: record['Subscription date'] || new Date().toISOString()
        };

        const existingContact = contactsByEmail.get(record.Email);

        if (existingContact) {
          console.log('Updating contact:', existingContact.email);
          await updateContact(existingContact.email, data);
          console.log(`Successfully updated ${record.Email}`);
        } else {
          await createContact(record.Email, data);
          console.log(`Successfully created ${record.Email}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing contact ${record.Email}:`, error.message);
      }
    }

    console.log('Import completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

importContacts();