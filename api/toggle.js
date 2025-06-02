import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { access_token, is_shielded } = req.body;

  if (!access_token || typeof is_shielded === 'undefined') {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const variables = {
    is_shielded: is_shielded === 'true' || is_shielded === true,
    session_id: 'session123', // static or generate as needed
    actor_id: access_token.split('|')[0], // attempt to extract user ID if possible
    client_mutation_id: 'client456'
  };

  const body = new URLSearchParams();
  body.append('variables', JSON.stringify(variables));
  body.append('doc_id', '1477043292367183');
  body.append('access_token', access_token);

  try {
    const response = await fetch('https://graph.facebook.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const data = await response.json();

    if (data?.data) {
      return res.status(200).json({ success: true, message: 'Profile Guard updated.' });
    } else {
      return res.status(400).json({
        success: false,
        message: data?.errors?.[0]?.message || 'Check your access token or permissions.'
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
