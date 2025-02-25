const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

async function getAccessGoogleToken() {
  const auth = new GoogleAuth({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: "https://www.googleapis.com/auth/cloud-platform"
});


  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log("Access Token:", token.token);
  return token.token;
}
getAccessGoogleToken()