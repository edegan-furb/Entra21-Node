const admin = require('firebase-admin');
const serviceAccount = require('./meuprojetoapi-ecec7-firebase-adminsdk-kjmu3-1f6b453153.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
module.exports = db;
