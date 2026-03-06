// Vercel serverless function — admin authentication
// Validates credentials against environment variables and returns a session token.

const crypto = require('crypto');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  const adminUser = process.env.ADMIN_USER || '';
  const adminPass = process.env.ADMIN_PASSWORD || '';

  if (!adminUser || !adminPass) {
    return res.status(500).json({ error: 'Admin credentials not configured on server.' });
  }

  if (username === adminUser && password === adminPass) {
    // Generate a simple session token (HMAC of user + timestamp + secret)
    const secret = process.env.ADMIN_SESSION_SECRET || adminPass;
    const timestamp = Date.now();
    const token = crypto
      .createHmac('sha256', secret)
      .update(`${adminUser}:${timestamp}`)
      .digest('hex');

    return res.status(200).json({ token, timestamp });
  }

  return res.status(401).json({ error: 'Invalid credentials.' });
};
