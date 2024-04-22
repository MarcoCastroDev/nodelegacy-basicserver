

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
async function googleVerify(token = '') {
  if (!token) {
    throw new Error('Token is required for verification');
  }
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, picture, email } = ticket.getPayload();

  return {
    name,
    img: picture,
    email
  }
}
// googleVerify().catch(console.error);

module.exports = {
  googleVerify,
}