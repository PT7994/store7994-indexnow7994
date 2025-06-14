import fetch from 'node-fetch';

const INDEXNOW_KEY = '0dc1c096ebbc4409980b9440bd8c4f55';
const DOMAIN = 'store7994.com';
const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const product = req.body;

    if (!product.handle) {
      return res.status(400).json({ error: 'Missing product handle in request body' });
    }

    const productUrl = `https://${DOMAIN}/products/${product.handle}`;

    const body = {
      host: DOMAIN,
      key: INDEXNOW_KEY,
      keyLocation: `https://${DOMAIN}/${INDEXNOW_KEY}.txt`,
      urls: [productUrl],
    };

    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      console.log(`Submitted URL to IndexNow: ${productUrl}`);
      res.status(200).json({ message: 'URL submitted to IndexNow' });
    } else {
      console.error('Failed to submit URL:', response.statusText);
      res.status(500).json({ error: 'Failed to submit URL to IndexNow' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
