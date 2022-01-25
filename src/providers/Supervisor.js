import {
  collection,
  getDoc,
  onSnapshot,
  query,
  where,
  doc,
  setDoc
} from 'firebase/firestore';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CAREER, useUser } from './User';
import { db } from '../firebase';
import { pendingIntention, sentReport } from '../InternshipStates';

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
  function setCareerForm(selectedCareerId, form, params = { merge: false }) {
    setDoc(doc(db, 'form', selectedCareerId), form, params);
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
        setCareerForm
      }}>
      {supervisorLoaded && children}
    </SupervisorContext.Provider>
  );
}
