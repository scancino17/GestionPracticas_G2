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
            .set({ careers: [], interns: {}, remarks: {} });

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

      console.log(`Employer assigned: ${data.employerEmail}`);
      console.log(`Employer found: ${employer.uid}`);

      admin
        .firestore()
        .collection('employers')
        .doc(employer.uid)
        .get()
        .then((doc) => {
          let docData = doc.data();

          const careers = docData.careers;
          if (!careers.includes(data.careerdId)) careers.push(data.careerId);

          admin
            .firestore()
            .collection('employers')
            .doc(employer.uid)
            .update({
              careers: careers,
              [`interns.${data.internshipId}`]: {
                studentId: data.studentId,
                careerId: data.careerId,
                employerEvaluated: false
              }
            });

          admin.firestore().collection('users').doc(data.studentId).update({
            'currentInternship.employerId': employer.uid,
            'currentInternship.employerName': employer.displayName,
            'currentInternship.employerEmail': employer.email
          });

          admin
            .firestore()
            .collection('internships')
            .doc(data.internshipId)
            .update({
              employerId: employer.uid,
              employerName: employer.displayName,
              employerEmail: employer.email,
              employerEvaluated: false
            });
        });
    });
});

exports.queueInternEmployerAssignment = functions.firestore
  .document('applications/{applicationId}')
  .onUpdate((change, context) => {
    // Revisar estado de application
    if (change.after.data().status === 'Aprobado') {
      // Aquí se necesitan todos estos valores que normalmente están presentes en la application.
      // Si por algún motivo se quitan de la application, habría que rescatarlos de los otros documentos.
      const { internshipId, studentId, careerId, employerEmail, employerName } =
        change.after.data();

      const docRef = admin
        .firestore()
        .collection('employerAssignmentRequest')
        .doc(employerEmail);

      docRef.get().then((docSnap) => {
        if (!docSnap.exists) {
          docRef.set({
            assignedInterns: {
              [internshipId]: {
                internshipId,
                studentId,
                careerId,
                queueTime: admin.firestore.FieldValue.serverTimestamp(),
                status: 'Pending',
                failedOn: []
              }
            },
            lastAssignment: {
              internshipId,
              studentId,
              careerId
            },
            employerEmail,
            employerName,
            status: 'Pending'
          });
        } else {
          if (!docSnap.data().assignedInterns[internshipId])
            docRef.update({
              status: 'Pending',
              [`assignedInterns.${internshipId}`]: {
                internshipId,
                studentId,
                careerId,
                queueTime: admin.firestore.FieldValue.serverTimestamp(),
                status: 'Pending'
              },
              lastAssignment: {
                internshipId,
                studentId,
                careerId
              },
              failedOn: []
            });
        }
      });
    }
  });

exports.autoCreateEmployer = functions.firestore
  .document('employerAssignmentRequest/{requestId}')
  .onCreate((change, context) => {
    const docData = change.data();
    const employerData = {
      name: docData.employerName,
      email: docData.employerEmail
    };
    const { lastAssignment } = docData;
    const randomPassword = Math.random().toString(36).slice(-8);

    admin
      .firestore()
      .collection('userCreationRequests')
      .add({
        userDetails: employerData,
        role: 'employer',
        status: 'Pending',
        createdBy: 'system',
        createdOn: admin.firestore.FieldValue.serverTimestamp()
      })
      .then((userCreationRequestRef) => {
        admin
          .auth()
          .createUser({
            email: employerData.email,
            password: randomPassword,
            displayName: employerData.name
          })
          .then((userRecord) => {
            admin.auth().setCustomUserClaims(userRecord.uid, {
              employer: true
            });
            userCreationRequestRef.update({ status: 'Treated' });
            functions.logger.info(
              `Employer ${userRecord.uid} (email: ${userRecord.email}) created successfully.`
            );

            const { careerId, internshipId, studentId } = lastAssignment;
            admin
              .firestore()
              .collection('employers')
              .doc(userRecord.uid)
              .set({
                careers: [careerId],
                interns: {
                  [internshipId]: {
                    studentId,
                    careerId,
                    employerEvaluated: false
                  }
                },
                remarks: {}
              })
              .then((value) =>
                functions.logger.info(
                  `UserDoc ${userRecord.uid} for employer successfully created`
                )
              );

            admin
              .firestore()
              .collection('users')
              .doc(studentId)
              .update({
                'currentInternship.employerId': userRecord.uid,
                'currentInternship.employerName': userRecord.displayName,
                'currentInternship.employerEmail': userRecord.email
              })
              .then((value) =>
                functions.logger.info(
                  `studentDoc ${studentId} successfully updated`
                )
              );

            admin
              .firestore()
              .collection('internships')
              .doc(internshipId)
              .update({
                employerId: userRecord.uid,
                employerName: userRecord.displayName,
                employerEmail: userRecord.email,
                employerEvaluated: false
              })
              .then((value) =>
                functions.logger.info(
                  `internshipDoc ${internshipId} successfully updated`
                )
              );

            admin
              .firestore()
              .collection('mails')
              .add({
                to: userRecord.email,
                template: {
                  name: 'Welcome',
                  data: {
                    from_name: userRecord.displayName,
                    password: randomPassword
                  }
                }
              })
              .then((value) =>
                functions.logger.info(
                  `Welcome email sent to ${userRecord.email}`
                )
              );

            admin
              .firestore()
              .collection('users')
              .doc(studentId)
              .get()
              .then((docSnap) => {
                const { name: studentName } = docSnap.data();
                admin
                  .firestore()
                  .collection('mails')
                  .add({
                    to: userRecord.email,
                    template: {
                      name: 'AssignedIntern',
                      data: {
                        studentName: studentName
                      }
                    }
                  })
                  .then((value) =>
                    functions.logger.info(
                      `Assigned intern email sent to ${userRecord.email}`
                    )
                  );
              });
          });
      })
      .then(() => {
        change.ref
          .update({
            status: 'Treated',
            [`assignedInterns.${lastAssignment.internshipId}.status`]: 'Treated'
          })
          .then((value) =>
            functions.logger.info(`Employer creation successfully treated`)
          );
      });
  });

exports.autoAssignInternEmployer = functions.firestore
  .document('employerAssignmentRequest/{requestId}')
  .onUpdate((change, context) => {
    const status = change.after.data().status;
    const failedOn = change.after.data().failedOn || [];

    if (status !== 'Pending' || status !== 'Failed') return;

    const employerEmail = context.params.requestId;
    const { lastAssignment } = change.after.data();

    admin
      .auth()
      .listUsers()
      .then((listUsersResult) => {
        let employer = listUsersResult.users
          .filter((item) => item.customClaims?.employer)
          .find((item) => item.email === employerEmail);

        admin
          .firestore()
          .collection('employers')
          .doc(employer.uid)
          .get()
          .then((doc) => {
            let docData = doc.data();

            const careers = docData.careers;
            const { internshipId, studentId, careerId } =
              change.after.data().lastAssignment;

            if (!careers.includes(careerId)) careers.push(careerId);

            if (
              status === 'Pending' ||
              failedOn.includes('employer assignment')
            )
              admin
                .firestore()
                .collection('employers')
                .doc(employer.uid)
                .update({
                  careers: careers,
                  [`interns.${internshipId}`]: {
                    studentId: studentId,
                    careerId: careerId,
                    employerEvaluated: false
                  }
                })
                .catch(() =>
                  change.after.ref.update({
                    status: 'Failed',
                    failedOn: admin.firestore.FieldValue.arrayUnion(
                      'employer assignment'
                    )
                  })
                );

            if (
              status === 'Pending' ||
              failedOn.includes('currentinternship assignment')
            )
              admin
                .firestore()
                .collection('users')
                .doc(studentId)
                .update({
                  'currentInternship.employerId': employer.uid,
                  'currentInternship.employerName': employer.displayName,
                  'currentInternship.employerEmail': employer.email
                })
                .catch(() =>
                  change.after.ref.update({
                    status: 'Failed',
                    failedOn: admin.firestore.FieldValue.arrayUnion(
                      'currentinternship assignment'
                    )
                  })
                );

            if (
              status === 'Pending' ||
              failedOn.includes(' internship assingment')
            )
              admin
                .firestore()
                .collection('internships')
                .doc(internshipId)
                .update({
                  employerId: employer.uid,
                  employerName: employer.displayName,
                  employerEmail: employer.email,
                  employerEvaluated: false
                })
                .catch(() =>
                  change.after.ref.update({
                    status: 'Failed',
                    failedOn: admin.firestore.FieldValue.arrayUnion(
                      'internship assignment'
                    )
                  })
                );

            if (status === 'Pending' || failedOn.includes('send email'))
              admin
                .firestore()
                .collection('users')
                .doc(studentId)
                .get()
                .then((docSnap) => {
                  const { name: studentName } = docSnap.data();
                  admin
                    .firestore()
                    .collection('mails')
                    .add({
                      to: userRecord.email,
                      template: {
                        name: 'AssignedIntern',
                        data: {
                          studentName: studentName
                        }
                      }
                    })
                    .catch(() => {
                      change.after.ref.update({
                        status: 'Failed',
                        failedOn:
                          admin.firestore.FieldValue.arrayUnion('send email')
                      });
                    })
                    .then((value) =>
                      functions.logger.info(
                        `Assigned intern email sent to ${userRecord.email}`
                      )
                    );
                })
                .catch(() =>
                  change.after.ref.update({
                    status: 'Failed',
                    failedOn:
                      admin.firestore.FieldValue.arrayUnion('send email')
                  })
                );
          });
      })
      .then(() => {
        change.after.ref
          .update({
            status: 'Treated',
            [`assignedInterns.${lastAssignment.internshipId}.status`]: 'Treated'
          })
          .then((value) =>
            functions.logger.info(`Employer assigment successfully treated`)
          );
      });
  });
