import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  PLUNK_API_KEY: string;
}

interface SubscribeRequest {
  email: string;
  name: string;
}

// Define allowed origins
const ALLOWED_ORIGINS = [
  'https://jonnyburch.com',
  'https://www.jonnyburch.com',
  'https://*.jonnyburch.pages.dev',
  'http://localhost:4321' // For local development
];

// Helper function to check if an origin matches our allowed patterns
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.includes('*')) {
      // Convert wildcard pattern to regex
      const pattern = allowed.replace('*', '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return allowed === origin;
  });
}

export default {
  async fetch(request: Request, env: { PLUNK_API_KEY: string }) {
    // Simple CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    try {
      // Check if API key exists
      if (!env.PLUNK_API_KEY) {
        console.error('PLUNK_API_KEY is not set');
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      const body = await request.json();

      if (!body.email || !body.name) {
        return new Response(
          JSON.stringify({ error: 'Email and name are required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      // Process the name to get first name
      const firstName = body.name.split(' ')[0];

      console.log('Making request to Plunk API...');
      const response = await fetch('https://api.useplunk.com/v1/track', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PLUNK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: 'newsletter_subscription',
          email: body.email,
          subscribed: true,
          data: {
            name: body.name,
            first_name: firstName,
            date_subscribed: new Date().toISOString(),
            source: 'jb_website_form'
          }
        })
      });

      const data = await response.json();
      console.log('Plunk API response:', data);

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: data.message || 'Failed to subscribe' }),
          {
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Successfully subscribed!' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch (error) {
      console.error('Error in subscribe endpoint:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  }
};