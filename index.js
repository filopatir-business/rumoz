const express = require('express');
const path = require('path');
const app = express();

// const firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');

// const firebaseConfig = {
//   apiKey: process.env['apiKey'],
//   authDomain: process.env['authDomain'],
//   databaseURL: process.env['databaseURL'],
//   projectId: process.env['projectId'],
//   storageBucket: process.env['storageBucket'],
//   messagingSenderId: process.env['messagingSenderId'],
//   appId: process.env['appId'],
//   measurementId: process.env['measurementId']
// };



// const application = firebase.initializeApp(firebaseConfig);

// var admin = require("firebase-admin");

// const adminConfig = {
//   type: "service_account",
//   project_id: process.env.project_id,
//   private_key_id: process.env.private_key_id,
//   private_key: process.env.private_key,
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert,
//   client_x509_cert_url: process.env.client_x509_cert_url,
//   universe_domain: "googleapis.com"
// };

// admin.initializeApp({
//   credential: admin.credential.cert(adminConfig),
//   databaseURL: "https://mfc-website-6a8ef-default-rtdb.europe-west1.firebasedatabase.app"
// });


app.use(express.static(path.join(__dirname, 'mfc'), { extensions: ['html'] }));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'mfc', 'error404.html'));
});



app.use(express.static('mfc'));



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});