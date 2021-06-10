const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const admin = require('firebase-admin');
const serviceAccount = require('./jpadel-app-firebase-adminsdk-l5d73-19d2c2cc7e.json');
const adminRoutes = require('./Admin/router');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json())

app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
});

module.exports = { app, admin, db }