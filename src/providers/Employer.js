import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { useUser } from './User';

const EmployerContext = React.createContext();

export function useEmployer() {
  return useContext(EmployerContext);
}

export function EmployerProvider({ children }) {
  // No hay userData para users employers. Este se almacena aparte, por lo que
  // debe obtenerce aparte.
  const { userId } = useUser();
  const [userData, setUserData] = useState();
  const [employerLoaded, setLoaded] = useState(false);
  const [internList, setInternList] = useState([]);

  useEffect(() => {
    return onSnapshot(doc(db, 'employers', userId), (doc) =>
      setUserData(doc.data())
    );
  }, [userId]);

  const getInterns = useCallback(() => {
    function addIntern(intern) {
      console.log(intern);
      setInternList((prevState) => {
        if (
          !prevState.find((item) => item.internshipId === intern.internshipId)
        ) {
          let newState = prevState.slice();
          newState.push(intern);
          return newState;
        } else return prevState;
      });
    }

    if (userData) {
      const dataList = userData.internships;

      dataList.forEach(async (intern) => {
        const internData = (
          await getDoc(doc(db, 'internships', intern.internshipId))
        ).data();

        const studentData = (
          await getDoc(doc(db, 'users', intern.studentId))
        ).data();

        addIntern({
          internshipId: intern.internshipId,
          studentId: intern.studentId,
          studentName: studentData.name,
          studentRut: studentData.rut,
          careerId: internData.careerId,
          studentCareer: studentData.careerName,
          internStart: internData.applicationData['Fecha de inicio'],
          internEnd: internData.applicationData['Fecha de término']
        });
      });
    }
  }, [userData]);

  async function updateEmployer(update) {
    await updateDoc(doc(db, 'employers', userId), update);
  }

  async function addRemark(internship, remark) {
    await updateEmployer({
      [`remarks.${Date.now()}`]: {
        studentId: internship.studentId,
        internshipId: internship.internshipId,
        careerId: internship.careerId,
        remark: remark,
        read: false,
        remarkTime: serverTimestamp()
      }
    });
  }

  useEffect(() => getInterns(), [getInterns]);
  useEffect(() => setLoaded(!!internList), [internList]);

  return (
    <EmployerContext.Provider
      value={{ employerLoaded, userData, internList, addRemark }}>
      {children}
    </EmployerContext.Provider>
  );
}
