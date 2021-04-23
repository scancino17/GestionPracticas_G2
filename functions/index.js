const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.processSignUp = functions.auth.user().onCreate((user) => {
  if (user.email && user.email.endsWith('@alumnos.utalca.cl')) {
    const customClaims = { student: true };
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        const metadataRef = admin.database().ref('metadata/' + user.uid);
        return metadataRef.set({ refreshTime: new Date().getTime() });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
