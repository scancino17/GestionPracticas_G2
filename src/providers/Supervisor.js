import {
  collection,
  getDoc,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CAREER, useUser } from './User';
import { db, functions, storage } from '../firebase';
import {
  approvedApplication,
  approvedExtension,
  approvedIntention,
  changeDetailsApplication,
  deniedApplication,
  deniedExtension,
  deniedIntention,
  finishedInternship,
  pendingIntention,
  reportNeedsChanges,
  sentReport
} from '../InternshipStates';
import { StudentNotificationTypes } from '../layout/NotificationMenu';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { httpsCallable } from 'firebase/functions';
import {
  predefinedForm,
  predefinedSurvey,
  predefinedEvaluation
} from '../dynamicForm/predefined_forms/predefined';
import { FormTypes } from '../dynamicForm/camps/FormTypes';

const SupervisorContext = React.createContext();

export function useSupervisor() {
  return useContext(SupervisorContext);
}

export function SupervisorProvider({ children }) {
  const { careerId, email, displayName } = useUser();
  const [supervisorLoaded, setSupervisorLoaded] = useState(false);
  const [applications, setApplications] = useState();
  const [internships, setInternships] = useState();
  const [students, setStudents] = useState();
  const [careers, setCareers] = useState();
  const [employers, setEmployers] = useState();
  const [evaluations, setEvaluations] = useState();

  useEffect(() => {
    return onSnapshot(collection(db, 'careers'), (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      setCareers(temp);
    });
  }, []);

  /**
   * Obtener aplicaciones, prácticas y estudiantes. Si el usuario pertenece a una carrera,
   * limitar a las carreras que le corresponde.
   */
  useEffect(() => {
    if (!careers) return;

    let appRef = collection(db, 'applications');
    let intRef = collection(db, 'internships');
    let stuRef = collection(db, 'users');
    let empRef = collection(db, 'employers');
    let evaRef = collection(db, 'send-evaluation');

    // Limitar a carrera que le corresponde
    if (careerId !== DEFAULT_CAREER) {
      appRef = query(appRef, where('careerId', '==', careerId));
      intRef = query(intRef, where('careerId', '==', careerId));
      stuRef = query(stuRef, where('careerId', '==', careerId));
      empRef = query(empRef, where('careers', 'array-contains', careerId));
      evaRef = query(evaRef, where('careerId', '==', careerId));
    }

    let appUnsub = onSnapshot(appRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const career = careers.find((item) => item.id === docData.careerId);
        const sigla = career ? career.sigla : 'N.E.';
        const name = career ? career.name : 'No encontrado';

        temp.push({
          id: doc.id,
          careerInitials: sigla,
          careerName: name,
          ...docData
        });
      });
      setApplications(temp);
    });

    let intUnsub = onSnapshot(intRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const career = careers.find((item) => item.id === docData.careerId);
        const sigla = career ? career.sigla : 'N.E';
        temp.push({
          id: doc.id,
          careerInitials: sigla,
          ...docData
        });
      });
      setInternships(temp);
    });

    let stuUnsub = onSnapshot(stuRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      setStudents(temp);
    });

    let empUnsub = onSnapshot(empRef, (querySnapshot) => {
      const temp = [];

      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        let carList = docData.careers.filter(
          (item) => careerId === DEFAULT_CAREER || item.careerId === careerId
        );
        let intList = docData.internships.filter(
          (item) => careerId === DEFAULT_CAREER || item.careerId === careerId
        );
        let remList = Object.entries(docData.remarks)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter(
            (item) => careerId === DEFAULT_CAREER || item.careerId === careerId
          );
        temp.push({
          id: doc.id,
          careers: carList,
          internships: intList,
          remarks: remList
        });
      });

      setEmployers(temp);
    });

    let evaUnsub = onSnapshot(evaRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      setEvaluations(temp);
    });

    return () => {
      appUnsub();
      intUnsub();
      stuUnsub();
      empUnsub();
      evaUnsub();
    };
  }, [careers, careerId]);

  useEffect(() => {
    if (applications && internships && students && careers && employers)
      setSupervisorLoaded(true);
  }, [applications, internships, students, careers, employers]);

  /** Llevar la cuenta de intenciones pendientes por revisar */
  const pendingIntentionsCount = useMemo(() => {
    if (internships)
      return internships.filter((item) => item.status === pendingIntention)
        .length;
    else return 0;
  }, [internships]);

  const pendingFormsCount = useMemo(() => {
    if (applications)
      return applications.filter((item) => item.status === 'En revisión')
        .length;
    else return 0;
  }, [applications]);

  const sentReportsCount = useMemo(() => {
    if (internships)
      return internships.filter((item) => item.status === sentReport).length;
    else return 0;
  }, [internships]);

  const ongoingInternshipsCount = useMemo(() => {
    if (students) return students.filter((item) => item.step >= 2).length;
    else return 0;
  }, [students]);

  const remarkList = useMemo(() => {
    if (!employers || !internships) return [];
    const remarks = [];

    employers.forEach(
      (employer) =>
        employer.remarks.length &&
        remarks.push(
          ...employer.remarks.map((remark, index) => {
            const {
              employerName,
              employerEmail,
              internshipNumber,
              studentName,
              careerName
            } = internships.find((item) => item.id === remark.internshipId);
            return {
              index: index,
              employerId: employer.id,
              employerName: employerName,
              employerEmail: employerEmail,
              internshipNumber: internshipNumber,
              studentName: studentName,
              careerName,
              ...remark
            };
          })
        )
    );

    return remarks;
  }, [employers, internships]);

  const employerEvaluations = useMemo(() => {
    const employerList = [];

    evaluations &&
      evaluations.forEach((evaluation) => {
        const {
          name: studentName,
          rut: studentRut,
          enrollmentNumber: studentNumber,
          email: studentEmail
        } = students.find((item) => item.id === evaluation.studentId);
        const { internshipNumber, careerInitials } = internships.find(
          (item) => item.id === evaluation.internshipId
        );
        employerList.push({
          ...evaluation,
          studentName,
          studentRut,
          studentNumber,
          studentEmail,
          internshipNumber,
          careerInitials
        });
      });
    return employerList;
  }, [evaluations, internships, students]);

  // formType debe ser uno de los valores del objeto FormTypes del archivo FormTypes.js
  async function getForm(formType, selectedCareerId) {
    function getPredefinedForm(formType) {
      switch (formType) {
        case FormTypes.SurveyForm:
          return predefinedSurvey;
        case FormTypes.EvaluationForm:
          return predefinedEvaluation;
        default:
          return predefinedForm;
      }
    }

    try {
      let response = await getDoc(doc(db, formType, selectedCareerId));
      return response.data().form;
    } catch {
      return getPredefinedForm(formType);
    }
  }

  // formType debe ser uno de los valores del objeto FormTypes del archivo FormTypes.js
  // form es un objeto que contiene el form. La estructura seria { form: ...<el_form> }
  // params está por si se quiere hacer merge con los datos en vez de reemplazar.
  // El comportamiento default es no pasar ningun param, y sobreescribir lo que ya había.
  async function setForm(
    formType,
    selectedCareerId,
    form,
    params = { merge: false }
  ) {
    await setDoc(doc(db, formType, selectedCareerId), form, params);
  }

  async function setSurveySended(form) {
    await addDoc('surveySended', form);
  }

  // mailTo es el correo al que se le enviará el mail.
  // templateName un string, el nombre del template a usar
  // Es decir, el nombre de uno de los archivos en /emailTemplates, sin la extensión
  // data es un json con los datos que pide el template, consultar que datos necesita cada uno.
  async function sendMail(mailTo, templateName, data) {
    await addDoc(collection(db, 'mails'), {
      to: mailTo,
      template: { name: templateName, data: data }
    });
  }

  // userId es el id del usuario al que se le enviará la notificación.
  // Hasta el momento sólo los students usan notifications.
  // notificationType es el tipo de la notificación, consultar /src/layout/NotificationMenu
  async function addNotification(userId, notificationType) {
    await updateDoc(doc(db, 'users', userId), {
      [`notifications.${Date.now().toString()}`]: {
        id: Date.now().toString(),
        type: notificationType,
        time: serverTimestamp()
      }
    });
  }

  // internshipId es el id de la internship
  // data es un json con los campos a actualizar
  async function updateInternship(internshipId, data) {
    await updateDoc(doc(db, 'internships', internshipId), data);
  }

  // applicationId es el id de la application
  // data es un json con los campos a actualizar
  async function updateApplication(applicationId, data) {
    await updateDoc(doc(db, 'applications', applicationId), data);
  }

  // userId es el id del user
  // data es un json con los campos a actualizar
  async function updateUser(userId, data) {
    await updateDoc(doc(db, 'users', userId), data);
  }

  async function updateCareer(careerId, data) {
    await updateDoc(doc(db, 'careers', careerId), data);
  }

  function getUserData(userId) {
    return students.find((item) => item.id === userId);
  }

  function getApplication(applicationId) {
    return applications.find((item) => item.id === applicationId);
  }

  function getInternship(internshipId) {
    return internships.find((item) => item.id === internshipId);
  }

  function getCurrentInternship(studentId) {
    return getUserData(studentId).currentInternship;
  }

  function getCareerData(careerId) {
    return careers.find((item) => item.id === careerId);
  }

  function approveApplication(appData, approveReason) {
    updateApplication(appData.id, {
      approvedDate: serverTimestamp(),
      status: 'Aprobado',
      reason: approveReason
    });

    updateInternship(appData.internshipId, {
      approvedDate: serverTimestamp(),
      status: approvedApplication,
      applicationData: appData,
      applicationId: appData.id,
      reason: approveReason
    });

    updateUser(appData.studentId, {
      reason: approveReason,
      'currentInternship.lastApplication': appData.id,
      'currentInternship.Empresa': appData.Empresa,
      step: 2
    }).then(() =>
      addNotification(
        appData.studentId,
        StudentNotificationTypes.approvedApplication
      )
    );

    let userData = getUserData(appData.studentId);
    sendMail(userData.email, 'Approved', {
      from_name: userData.name
    });
  }

  function rejectApplication(appData, rejectReason) {
    updateApplication(appData.id, {
      rejectDate: serverTimestamp(),
      status: 'Rechazado',
      reason: rejectReason
    });

    updateInternship(appData.internshipId, {
      status: deniedApplication
    });

    updateUser(appData.studentId, {
      'currentInternship.lastApplication': appData.id
    }).then(() =>
      addNotification(
        appData.studentId,
        StudentNotificationTypes.deniedApplication
      )
    );

    let userData = getUserData(appData.studentId);
    sendMail(userData.email, 'Failed', {
      from_name: userData.name,
      result: rejectReason
    });
  }

  // Existe la posibilidad de que rejectReason sea innecesario aquí.
  // En ese caso, bastaría con reemplazar rejectReason por changes.
  function amendApplication(appData, rejectReason, changes) {
    updateInternship(appData.internshipId, {
      status: changeDetailsApplication
    });

    updateApplication(appData.id, {
      status: 'Necesita cambios menores',
      reason: changes,
      minorChangeRequestDate: serverTimestamp()
    });

    updateUser(appData.studentId, {
      'currentInternship.lastApplication': appData.id
    }).then(() =>
      addNotification(
        appData.studentId,
        StudentNotificationTypes.changeDetailsApplication
      )
    );

    let userData = getUserData(appData.studentId);
    sendMail(userData.email, 'FailedMinorChanges', {
      from_name: userData.name,
      result: rejectReason
    });
  }

  function rejectInternshipIntention(internship, reason) {
    updateInternship(internship.id, {
      status: deniedIntention,
      reason: reason,
      evaluatingSupervisor: { name: displayName, email: email }
    });

    addNotification(
      internship.studentId,
      StudentNotificationTypes.deniedIntention
    );

    sendMail(internship.email, 'FailedIntention', {
      from_name: internship.name,
      result: reason,
      rechazado_por: displayName,
      rechazado_por_email: email
    });
  }

  function approveInternshipIntention(internship, reason, files) {
    updateInternship(internship.id, {
      status: approvedIntention,
      reason: reason,
      evaluatingSupervisor: { name: displayName, email: email },
      seguroDisponible: false,
      alreadyDownloaded: false
    });

    files.forEach((file) => {
      uploadBytes(
        ref(
          storage,
          `students-docs/${internship.studentId}/${internship.id}/internship-intention/${file.name}`
        ),
        file
      );
    });

    sendMail(internship.email, 'approvedIntention', {
      from_name: internship.name,
      aprobado_por: displayName,
      razon_aprobacion: reason ? reason : 'Sin observaciones'
    });

    updateUser(internship.studentId, {
      currentInternship: {
        id: internship.id,
        number: internship.internshipNumber
      }
    }).then(() =>
      addNotification(
        internship.studentId,
        StudentNotificationTypes.approvedIntention
      )
    );
  }

  // Aquí sería interesante implementar una notificación, y un correo
  function submitInsurance(internship, files) {
    updateInternship(internship.id, {
      seguroDisponible: true,
      alreadyDownloaded: true
    });

    files.forEach((file) => {
      uploadBytes(
        ref(
          storage,
          `students-docs/${internship.studentId}/${internship.id}/seguro-practica/${file.name}`
        ),
        file
      );
    });
  }

  function amendReport(internshipId, student, reason) {
    let rawReason = convertToRaw(reason);
    updateInternship(internshipId, {
      status: reportNeedsChanges,
      reportAnnotations: rawReason
    });

    sendMail(student.email, 'ReportFailed', {
      from_name: student.name,
      reason: draftToHtml(rawReason),
      rechazado_por: displayName
    });

    addNotification(student.id, StudentNotificationTypes.reportNeedChanges);
  }

  function evaluateReport(internshipId, student, reason, grade) {
    updateInternship(internshipId, {
      status: finishedInternship,
      reason: reason ? reason : 'Sin observaciones',
      grade: grade
    });

    sendMail(student.email, 'ReportApproved', {
      from_name: student.name,
      grade: grade,
      reason: reason ? reason : 'Sin observaciones',
      aprovado_por: displayName
    });

    updateUser(student.id, { step: 0 }).then(() =>
      addNotification(student.id, StudentNotificationTypes.finishedInternship)
    );
  }

  function rejectExtension(internship, reason) {
    // OJO: aquí habia mencion a "cambiar statusExeption"
    updateInternship(internship.id, {
      extensionStatus: deniedExtension,
      dateExtension: '',
      reasonExtension: reason ? reason : 'Sin observaciones'
    });

    sendMail(internship.studentEmail, 'ExtensionFailed', {
      from_name: internship.studentName,
      result: reason ? reason : 'Sin observaciones',
      rechazado_por: displayName
    });

    addNotification(
      internship.studentId,
      StudentNotificationTypes.deniedExtension
    );
  }

  function approveExtension(internship, reason) {
    const application = { ...getApplication(internship.applicationId) };
    application['Fecha de término'] = internship.dateExtension;

    // Esto de aquí hay que simplificarlo
    application['form'].forEach((step) => {
      step['form'].forEach((camp) => {
        if (
          camp['type'] === 'Campos predefinidos' &&
          camp['name'] === 'Fecha de término'
        ) {
          //cambiar el valor en el formulario
          camp['value'] = internship.dateExtension;
        }
      });
    });

    updateApplication(internship.applicationId, { ...application });

    updateInternship(internship.id, {
      extensionStatus: approvedExtension,
      dateExtension: internship.dateExtension,
      reasonExtension: reason ? reason : 'Sin observaciones',
      'applicationData.Fecha de término': internship.dateExtension
      //cambiar statusExeption
    });

    sendMail(internship.studentEmail, 'ExtensionApproved', {
      from_name: internship.studentName,
      aprobado_por: displayName,
      razon_aprobacion: reason ? reason : 'Sin observaciones'
    });

    addNotification(
      internship.studentId,
      StudentNotificationTypes.approvedExtension
    );
  }

  function resetStudent(studentEmail) {
    let studentId = students.find((item) => item.email === studentEmail).id;

    const internshipsIds = [];
    internships.forEach((item) => {
      if (item.studentId === studentId) internshipsIds.push(item.id);
    });

    const applicationsId = [];
    applications.forEach((item) => {
      if (item.studentId === studentId) applicationsId.push(item.id);
    });

    const restoreStudent = httpsCallable(functions, 'restoreStudent');
    restoreStudent({
      studentId: studentId,
      internships: internshipsIds,
      applications,
      applicationsId
    });
  }

  async function updateEmployer(employerId, update) {
    await updateDoc(doc(db, 'employers', employerId), update);
  }

  async function updateRemark(remark, update) {
    const {
      employerName,
      employerEmail,
      internshipNumber,
      studentName,
      careerName,
      id,
      index,
      ...reducedRemark
    } = remark;
    await updateEmployer(remark.employerId, {
      [`remarks.${remark.id}`]: {
        ...reducedRemark,
        updateTime: serverTimestamp(),
        evaluatingSupervisor: { name: displayName, email: email },
        ...update
      }
    });
  }

  return (
    <SupervisorContext.Provider
      value={{
        supervisorLoaded,
        applications,
        internships,
        students,
        careers,
        employers,
        pendingIntentionsCount,
        pendingFormsCount,
        sentReportsCount,
        ongoingInternshipsCount,
        remarkList,
        employerEvaluations,
        getForm,
        setForm,
        setSurveySended,
        updateInternship,
        getUserData,
        getApplication,
        getInternship,
        getCurrentInternship,
        getCareerData,
        updateCareer,
        updateApplication,
        approveApplication,
        rejectApplication,
        amendApplication,
        rejectInternshipIntention,
        approveInternshipIntention,
        submitInsurance,
        amendReport,
        evaluateReport,
        rejectExtension,
        approveExtension,
        resetStudent,
        updateRemark
      }}>
      {supervisorLoaded && children}
    </SupervisorContext.Provider>
  );
}
