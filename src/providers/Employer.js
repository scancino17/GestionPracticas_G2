import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { FormTypes } from '../dynamicForm/camps/FormTypes';
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

  const remarksMap = useMemo(() => {
    if (!userData) return new Map();
    const remarksMap = new Map();
    const internships = userData.internships.map((item) => item.internshipId);
    internships.forEach((internship) => remarksMap.set(internship, []));

    Object.entries(userData.remarks)
      .map(([key, value]) => ({ id: key, ...value }))
      .forEach((remark) => {
        if (remarksMap.has(remark.internshipId)) {
          const list = remarksMap.get(remark.internshipId).slice();
          list.push(remark);
          remarksMap.set(remark.internshipId, list);
        }
      });

    Array.from(remarksMap.values()).forEach((list) =>
      list.sort((f, s) => s.id - f.id)
    );

    return remarksMap;
  }, [userData]);

  const getInterns = useCallback(() => {
    function addIntern(intern) {
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
          employerEvaluated: intern.employerEvaluated,
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

  const evaluationForms = useMemo(() => {
    const map = new Map();
    if (userData) {
      userData.careers.forEach((career) =>
        getDoc(doc(db, FormTypes.EvaluationForm, career)).then((docData) =>
          map.set(career, docData.data().form)
        )
      );
    }
    return map;
  }, [userData]);

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

  function getInternData(internshipId) {
    return internList.find((item) => item.internshipId === internshipId);
  }

  function updateInternData(internshipId, update) {
    const oldIntern = userData.internships.find(
      (item) => item.internshipId === internshipId
    );

    if (!oldIntern) return;
    const newList = userData.internships
      .filter((item) => item.internshipId !== internshipId)
      .slice();
    newList.push({
      ...oldIntern,
      ...update
    });
    updateEmployer({ internships: newList });
  }

  useEffect(() => getInterns(), [getInterns]);
  useEffect(() => setLoaded(!!internList), [internList]);

  return (
    <EmployerContext.Provider
      value={{
        employerLoaded,
        userData,
        internList,
        remarksMap,
        evaluationForms,
        addRemark,
        getInternData,
        updateInternData
      }}>
      {children}
    </EmployerContext.Provider>
  );
}
