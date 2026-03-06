// Vercel Serverless Function — Returns visitor country code from Vercel's geo headers
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const country = req.headers['x-vercel-ip-country'] || '';
  res.status(200).json({ country });
};
