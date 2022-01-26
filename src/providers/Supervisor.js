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
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CAREER, useUser } from './User';
import { db } from '../firebase';
import {
  approvedApplication,
  changeDetailsApplication,
  deniedApplication,
  pendingIntention,
  sentReport
} from '../InternshipStates';
import { StudentNotificationTypes } from '../layout/NotificationMenu';

const SupervisorContext = React.createContext();

export function useSupervisor() {
  return useContext(SupervisorContext);
}

export function SupervisorProvider({ children }) {
  const { careerId } = useUser();
  const [supervisorLoaded, setSupervisorLoaded] = useState(false);
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [careers, setCareers] = useState([]);

  /**
   * Obtener aplicaciones, prácticas y estudiantes. Si el usuario pertenece a una carrera,
   * limitar a las carreras que le corresponde.
   */
  useEffect(() => {
    let appRef = collection(db, 'applications');
    let intRef = collection(db, 'internships');
    let stuRef = collection(db, 'users');

    // Limitar a carrera que le corresponde
    if (careerId !== DEFAULT_CAREER) {
      appRef = query(appRef, where('careerId', '==', careerId));
      intRef = query(intRef, where('careerId', '==', careerId));
      stuRef = query(stuRef, where('careerId', '==', careerId));
    }

    let appUnsub = onSnapshot(appRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      console.log('apps', temp);
      setApplications(temp);
    });

    let intUnsub = onSnapshot(intRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      console.log('ints', temp);
      setInternships(temp);
    });

    let stuUnsub = onSnapshot(stuRef, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      console.log('stus', temp);
      setStudents(temp);
    });

    return () => {
      appUnsub();
      intUnsub();
      stuUnsub();
    };
  }, [careerId]);

  useEffect(() => {
    return onSnapshot(collection(db, 'careers'), (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      setCareers(temp);
    });
  }, []);

  useEffect(() => {
    if (applications && internships && students) setSupervisorLoaded(true);
  }, [applications, internships, students]);

  /** Llevar la cuenta de intenciones pendientes por revisar */
  const pendingIntentionsCount = useMemo(() => {
    return internships.filter((item) => item.status === pendingIntention)
      .length;
  }, [internships]);

  const pendingFormsCount = useMemo(() => {
    return applications.filter((item) => item.status === 'En revisión').length;
  }, [applications]);

  const sentReportsCount = useMemo(() => {
    return internships.filter((item) => item.status === sentReport).length;
  }, [internships]);

  const ongoingInternshipsCount = useMemo(() => {
    return internships.filter((item) => item.step >= 2).length;
  }, [internships]);

  async function getCareerForm(selectedCareerId) {
    let response = await getDoc(doc(db, 'form', selectedCareerId));
    return response.data().form;
  }

  // form es un objeto que contiene el form. La estructura seria { form: ...<el_form> }
  // params está por si se quiere hacer merge con los datos en vez de reemplazar.
  // El comportamiento default es no pasar ningun param, y sobreescribir lo que ya había.
  async function setCareerForm(
    selectedCareerId,
    form,
    params = { merge: false }
  ) {
    await setDoc(doc(db, 'form', selectedCareerId), form, params);
  }

  // mailTo es el correo al que se le enviará el mail.
  // templateName un string, el nombre del template a usar
  // Es decir, el nombre de uno de los archivos en /emailTemplates, sin la extensión
  // data es un json con los datos que pide el template, consultar que datos necesita cada uno.
  async function sendMail(mailTo, templateName, data) {
    await addDoc(collection(db, 'mails'), {
      to: mailTo,
      template: templateName,
      data: data
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

  function getUserData(userId) {
    return students.find((item) => item.id === userId);
  }

  function getApplication(applicationId) {
    return applications.find((item) => item.id === applicationId);
  }

  function approveApplication(appData, approveReason) {
    updateApplication(appData.id, {
      status: 'Aprobado',
      reason: approveReason
    });

    updateInternship(appData.internshipId, {
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
        appData.student.id,
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
      reason: changes
    });

    updateUser(appData.userId, {
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

  return (
    <SupervisorContext.Provider
      value={{
        applications,
        internships,
        students,
        careers,
        pendingIntentionsCount,
        pendingFormsCount,
        sentReportsCount,
        ongoingInternshipsCount,
        getCareerForm,
        setCareerForm,
        getUserData,
        getApplication,
        updateApplication,
        approveApplication,
        rejectApplication,
        amendApplication
      }}>
      {supervisorLoaded && children}
    </SupervisorContext.Provider>
  );
}
