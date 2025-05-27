export async function onRequestPost(context) {
  // Handle CORS preflight requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    const { email, name } = await context.request.json();

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

    const response = await fetch('https://api.useplunk.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.PLUNK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        subscribed: true,
        data: {
          name,
          date_subscribed: new Date().toISOString()
        }
      })
    });

    const data = await response.json();

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
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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