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
    "0": {
      is_shielded: is_shielded === 'true' || is_shielded === true,
      session_id: "session123",
      client_mutation_id: "client456"
    }
  };

  const url = `https://graph.facebook.com/graphql?variables=${encodeURIComponent(
    JSON.stringify(variables)
  )}&method=post&doc_id=1477043292367183&access_token=${encodeURIComponent(access_token)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.data) {
      return res.status(200).json({ success: true, message: 'Profile Guard updated.' });
    } else {
      return res.status(400).json({ success: false, message: 'Check your access token or permissions.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

