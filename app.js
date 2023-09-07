const express = require('express')
require('dotenv').config();
const admin = require('firebase-admin');
const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT;

const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Initialize Firebase Admin SDK
const serviceAccount = require('./config');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add your Firebase database URL
  databaseURL: 'https://iot-temprature-air-quality-default-rtdb.firebaseio.com/',
});

const db = admin.database();
db.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('Firebase database connection success!');
  } else {
    console.log('Firebase database connection lost.');
  }
});

// Include your routes
const mainRoutes = require('./routes/MainRoutes');
app.use('/api', mainRoutes);

app.listen(PORT, () => console.log(`Server running on port ${APP_URL}`))


