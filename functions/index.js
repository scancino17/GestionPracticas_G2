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
  if (user.email && user.email.endsWith('@utalca.cl')) {
    const customClaims = { admin: true };
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .catch((error) => {
        functions.logger.error(error);
      });
  }
});

exports.importStudents = functions.https.onCall((data, context) => {
  let userCreationRequestRef;
  admin
    .firestore()
    .collection('userCreationRequests')
    .add({
      userDetails: data,
      role: 'student',
      status: 'Pending',
      createdBy: context.auth.uid,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
    .then((ref) => (userCreationRequestRef = ref));
  admin
    .auth()
    .createUser({
      email: data.email,
      password: data.password,
      displayName: data.name
    })
    .then((userRecord) => {
      admin.firestore().collection('users').doc(userRecord.uid).set(data);
      // TODO: add the internships correctly
      admin.firestore().collection('internships').add({
        applicationNumber: 1,
        careerId: data.careerId,
        status: 'Práctica disponible',
        studentId: userRecord.uid
      });
      userCreationRequestRef.update({ status: 'Treated' });
      return { result: `Student ${userRecord.uid} created successfully.` };
    });
});

exports.createSupervisor = functions.https.onCall((data, context) => {
  let userCreationRequestRef;
  admin
    .firestore()
    .collection('userCreationRequests')
    .add({
      userDetails: data,
      role: 'supervisor',
      status: 'Pending',
      createdBy: context.auth.uid,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
    .then((ref) => (userCreationRequestRef = ref));
  admin
    .auth()
    .createUser({
      email: data.email,
      password: data.password,
      displayName: data.name
    })
    .then((user) => {
      admin.auth().setCustomUserClaims(user.uid, {
        supervisor: true,
        careerId: data.careerId
      });
      userCreationRequestRef.update({ status: 'Treated' });
      return { result: `Supervisor ${userRecord.uid} created successfully.` };
    });
});
