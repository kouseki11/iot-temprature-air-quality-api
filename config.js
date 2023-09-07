require('dotenv').config();

const firebaseConfig = {
  "type": "service_account",
  "project_id": process.env.DATABASE_PROJECT_ID,
  "private_key_id": process.env.DATABASE_PROJECT_KEY_ID,
  "private_key": process.env.DATABASE_KEY,
  "client_email": process.env.DATABASE_CLIENT_EMAIL,
  "client_id": process.env.DATABESE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.DATABASE_CLIENT_CERT_URL,
  "universe_domain": "googleapis.com"
}

module.exports = firebaseConfig