import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { useUser } from './User';
import { db } from '../firebase';
import { pendingIntention } from '../InternshipStates';

export const StudentContext = React.createContext();

export function useStudent() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const { userId, userData, userLoaded, careerId } = useUser();
  const [step, setStep] = useState(0);
  const [internships, setInternships] = useState();
  const [currentInternship, setCurrentInternship] = useState();
  const [currentInternshipData, setCurrentInternshipData] = useState();
  const [lastApplication, setLastApplication] = useState({
    reason: 'Cargando...'
  });
  const [studentName, setStudentName] = useState('');
  const [studentRut, setStudentRut] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentCareerId, setStudentCareerId] = useState();
  const [studentLoaded, setStudentLoaded] = useState(false);
  const [careerInfo, setCareerInfo] = useState();

  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, 'internships'),
        where('studentId', '==', userId)
      );

      return onSnapshot(q, (querySnapshot) => {
        const temp = [];

        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );
        temp.sort((a, b) => (a.internshipNumber > b.internshipNumber ? 1 : -1));

        setInternships(temp);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userData && internships) {
      setStep(userData.step);
      setCurrentInternship(userData.currentInternship);
      setStudentName(userData.name);
      setStudentRut(userData.rut);
      setStudentEmail(userData.email);
      setStudentNumber(userData.enrollmentNumber);
      setStudentCareerId(userData.careerId);
      setStudentLoaded(true);
    }
  }, [userData, internships]);

  useEffect(() => {
    return onSnapshot(doc(db, 'careers', careerId), (querySnapshot) => {
      setCareerInfo(querySnapshot.data());
    });
  });

  useEffect(() => {
    if (currentInternship) {
      return onSnapshot(doc(db, 'internships', currentInternship.id), (doc) => {
        setCurrentInternshipData(doc.data());
      });
    }
  }, [currentInternship]);

  // Esto hace que lastapplication cambie cuando currentinternship cambie
  const setLastApplicationCallback = useCallback(async () => {
    if (currentInternship && currentInternship.lastApplication) {
      const docRef = doc(db, 'applications', currentInternship.lastApplication);
      const docSnap = await getDoc(docRef);
      setLastApplication(
        docSnap.exists()
          ? docSnap.data()
          : {
              reason: 'Cargando...'
            }
      );
    }
  }, [currentInternship]);

  // Correr el callback para el lastApplication
  useEffect(() => setLastApplicationCallback(), [setLastApplicationCallback]);

  // update debe ser un objeto con los cambios a realizar
  async function updateUser(update) {
    await updateDoc(doc(db, 'users', userId), update);
  }

  // update debe ser un objeto con los cambios a realizar
  async function updateCurrentInternship(update) {
    await updateDoc(doc(db, 'internships', currentInternship.id), update);
  }

  async function updateInternship(id, update) {
    await updateDoc(doc(db, 'internships', id), update);
  }
  async function newInternship(number, idLastInter) {
    await addDoc(collection(db, 'internships'), {
      careerId: careerId,
      careerName: careerInfo.name,
      internshipNumber: number,
      status: pendingIntention,
      studentEmail: userData.email,
      studentId: userId,
      studentName: userData.name,
      sentTime: serverTimestamp()
    })
      .then((docRef) => {
        updateDoc(doc(db, 'internships', idLastInter), { disabled: true });

        //se guarda los archivos en la application correspondiente
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  return (
    <StudentContext.Provider
      value={{
        internships,
        lastApplication,
        step,
        studentName,
        studentRut,
        studentEmail,
        studentNumber,
        studentCareerId,
        studentLoaded,
        careerInfo,
        currentInternship,
        currentInternshipData,
        updateUser,
        updateInternship,
        updateCurrentInternship,
        newInternship
      }}>
      {userLoaded && children}
    </StudentContext.Provider>
  );
}
