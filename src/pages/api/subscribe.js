export const prerender = false;

export async function POST({ request }) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Email and name are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Process the name to get first name
    const firstName = name.split(' ')[0];

    // Check if API key exists
    if (!import.meta.env.PLUNK_API_KEY) {
      console.error('PLUNK_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    console.log('Making request to Plunk API...');
    const response = await fetch('https://api.useplunk.com/v1/track', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.PLUNK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'newsletter_subscription',
        email,
        subscribed: true,
        data: {
          name,
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
            'Access-Control-Allow-Origin': '*'
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
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}