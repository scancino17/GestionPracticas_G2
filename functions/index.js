const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.processSignUp = functions.auth.user().onCreate((user) => {
  if (user.email && user.email.endsWith('@alumnos.utalca.cl')) {
    const customClaims = { student: true };
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .catch((error) => {
        functions.logger.error(error);
      });
  }
});
