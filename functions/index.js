const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.importStudents = functions.https.onCall((data, context) => {
  const randomPassword = Math.random().toString(36).slice(-8);
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
    .then((userCreationRequestRef) => {
      admin
        .auth()
        .createUser({
          email: data.email,
          password: randomPassword,
          displayName: data.name
        })
        .then((userRecord) => {
          admin.auth().setCustomUserClaims(userRecord.uid, {
            student: true,
            careerId: data.careerId
          });
          admin.firestore().collection('users').doc(userRecord.uid).set(data);
          admin
            .firestore()
            .collection('careers')
            .doc(data.careerId.toString())
            .get()
            .then((careerDoc) => {
              const internships = careerDoc.data().internships;
              for (let i = 0; i < internships; i++)
                admin
                  .firestore()
                  .collection('internships')
                  .add({
                    internshipNumber: i + 1,
                    careerId: data.careerId,
                    careerName: data.careerName,
                    status: 'Práctica disponible',
                    studentEmail: data.email,
                    studentId: userRecord.uid,
                    studentName: data.name
                  });
              admin
                .firestore()
                .collection('mails')
                .add({
                  to: data.email,
                  template: {
                    name: 'Welcome',
                    data: {
                      from_name: data.name,
                      password: randomPassword
                    }
                  }
                });
              userCreationRequestRef.update({ status: 'Treated' });
              functions.logger.info(
                `Student ${userRecord.uid} created successfully.`
              );
            });
        });
    });
});

exports.createSupervisor = functions.https.onCall((data, context) => {
  const randomPassword = Math.random().toString(36).slice(-8);
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
    .then((userCreationRequestRef) => {
      admin
        .auth()
        .createUser({
          email: data.email,
          password: randomPassword,
          displayName: data.name
        })
        .then((userRecord) => {
          admin.auth().setCustomUserClaims(userRecord.uid, {
            supervisor: true,
            careerId: data.careerId
          });
          userCreationRequestRef.update({ status: 'Treated' });
          functions.logger.info(
            `Supervisor ${userRecord.uid} created successfully.`
          );
          admin
            .firestore()
            .collection('mails')
            .add({
              to: data.email,
              template: {
                name: 'Welcome',
                data: {
                  from_name: data.name,
                  password: randomPassword
                }
              }
            });
        });
    });
});

exports.listSupervisors = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      const supervisors = [];
      listUsersResult.users.forEach((userRecord) => {
        if (userRecord.customClaims && userRecord.customClaims.supervisor)
          supervisors.push(userRecord);
      });
      return supervisors;
    });
});

exports.editSupervisor = functions.https.onCall((data, context) => {
  admin
    .auth()
    .updateUser(data.uid, {
      displayName: data.displayName
    })
    .then(() =>
      admin.auth().setCustomUserClaims(data.uid, {
        supervisor: true,
        careerId: data.careerId
      })
    )
    .then(() => console.log(`Updated supervisor ${data.uid}`))
    .catch((error) =>
      console.log('An error occured while editing supervisor: ', error)
    );
});

exports.deleteSupervisor = functions.https.onCall((data, context) => {
  admin
    .auth()
    .deleteUser(data.uid)
    .then(() => console.log(`Deleted supervisor ${data.uid}`))
    .catch((error) =>
      console.log('An error occured while deleting supervisor: ', error)
    );
});

exports.makeAdmin = functions.https.onCall((data, context) => {
  admin
    .auth()
    .updateUser(data.uid, { displayName: data.name })
    .then(() => {
      admin
        .auth()
        .setCustomUserClaims(data.uid, { admin: true })
        .then(() => functions.logger.info(`User ${data.uid} is now admin`));
    });
});

exports.restoreStudent = functions.https.onCall((data, context) => {
  let userData;
  admin
    .firestore()
    .collection('users')
    .doc(data.studentId)
    .get()
    .then((docSnap) => {
      userData = docSnap.data();
      for (let i = 0; i < data.internships.length; i++) {
        internshipId = data.internships[i];
        admin
          .firestore()
          .collection('internships')
          .doc(internshipId)
          .set({
            internshipNumber: i + 1,
            careerId: userData.careerId,
            careerName: userData.careerName,
            status: 'Práctica disponible',
            studentEmail: userData.email,
            studentId: data.studentId,
            studentName: userData.name
          })
          .then(() =>
            functions.logger.info(
              `Internship ${internshipId} was reset to original values`
            )
          );
      }
    });

  admin
    .firestore()
    .collection('users')
    .doc(data.studentId)
    .set({ step: 0 }, { merge: true })
    .then(() => functions.logger.info(`User ${studentId} step is set to 0`));

  data.applications.forEach((applicationId) =>
    admin
      .firestore()
      .collection('applications')
      .doc(applicationId)
      .delete()
      .then(() =>
        functions.logger.info(
          `Application ${applicationId} was sucessfully deleted`
        )
      )
  );
});

exports.createEmployer = functions.https.onCall((data, context) => {
  const randomPassword = Math.random().toString(36).slice(-8);
  admin
    .firestore()
    .collection('userCreationRequests')
    .add({
      userDetails: data,
      role: 'employer',
      status: 'Pending',
      createdBy: context.auth.uid,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
    .then((userCreationRequestRef) => {
      admin
        .auth()
        .createUser({
          email: data.email,
          password: randomPassword,
          displayName: data.name
        })
        .then((userRecord) => {
          admin.auth().setCustomUserClaims(userRecord.uid, {
            employer: true
          });
          userCreationRequestRef.update({ status: 'Treated' });
          functions.logger.info(
            `Employer ${userRecord.uid} created successfully.`
          );

          admin
            .firestore()
            .collection('employers')
            .doc(userRecord.uid)
            .set({ careers: [], internships: [], remarks: {} });

          admin
            .firestore()
            .collection('mails')
            .add({
              to: data.email,
              template: {
                name: 'Welcome',
                data: {
                  from_name: data.name,
                  password: randomPassword
                }
              }
            });
        });
    });
});

exports.assignInternshipToEmployer = functions.https.onCall((data, context) => {
  admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      let employer = listUsersResult.users
        .filter((item) => item.customClaims && item.customClaims.employer)
        .find((item) => item.email === data.employerEmail);

      console.log(`Employer found: ${employer.id}`);

      admin
        .firestore()
        .collection('employers')
        .doc(employer.id)
        .get()
        .then((doc) => {
          let docData = doc.data();
          const internships = docData.internships;
          console.log(internships);

          const careers = docData.careers;
          if (!careers.includes(data.careerdId)) careers.push(data.careerId);

          internships.push({
            studentId: data.studentId,
            internshipId: data.internshipId,
            careerId: data.careerId
          });

          admin
            .firestore()
            .collection('employers')
            .doc(employer.id)
            .update({ careers: careers, internships: internships });

          admin.firestore().collection('users').doc(data.studentId).update({
            'currentInternship.employerId': employer.id,
            'currentInternship.employerName': employer.displayName,
            'currentInternship.employerEmail': employer.email
          });

          admin
            .firestore()
            .collection('internships')
            .doc(data.internshipId)
            .update({
              employerId: employer.id,
              employerName: employer.displayName,
              employerEmail: employer.email
            });
        });
    });
});
