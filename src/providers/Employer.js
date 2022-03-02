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
  const [sentEvaluations, setSentEvaluations] = useState();
  const isEqual = require('lodash/isEqual');

  useEffect(() => {
    return onSnapshot(doc(db, 'employers', userId), (doc) =>
      setUserData(doc.data())
    );
  }, [userId]);

  const loadInterns = useCallback(() => {
    if (!userData) return;

    function addIntern(intern) {
      const sortFn = (f, s) => f.internEnd.seconds - s.internEnd.seconds;

      setInternList((prevState) => {
        const inList = prevState.find(
          (item) => item.internshipId === intern.internshipId
        );

        if (inList) {
          if (!isEqual(inList, intern)) {
            const newList = prevState
              .slice()
              .filter((item) => item.internshipId !== inList.internshipId);
            newList.push(intern);
            newList.sort(sortFn);
            return newList;
          } else {
            return prevState;
          }
        } else {
          const newList = prevState.slice();
          newList.push(intern);
          newList.sort(sortFn);
          return newList;
        }
      });
    }

    Object.entries(userData.interns).forEach(([key, value]) => {
      const { studentId } = value;
      const internshipId = key;

      getDoc(doc(db, 'internships', internshipId)).then((internDoc) => {
        const internship = internDoc.data();
        getDoc(doc(db, 'users', studentId)).then((studentDoc) => {
          const student = studentDoc.data();

          // Ojo: acá hay que preocuparse de cargar los datos requeridos
          // por los campos requeridos del formulario de inscripción
          // Estos tienen que llevar el key correspondiente al propName de cada
          // valor requerido.
          console.log(internshipId, internship);
          const { careerId, applicationData } = internship;
          const {
            'Fecha de inicio': internStart,
            'Fecha de término': internEnd,
            studentPhone
          } = applicationData;
          const {
            name: studentName,
            rut: studentRut,
            careerName: studentCareer,
            email: studentEmail,
            enrollmentNumber: studentNumber
          } = student;
          addIntern({
            internshipId,
            studentId,
            careerId,
            internStart,
            internEnd,
            studentName,
            studentRut,
            studentCareer,
            studentEmail,
            studentNumber,
            studentPhone,
            ...value
          });
        });
      });
    });
  }, [isEqual, userData]);

  useEffect(() => loadInterns(), [loadInterns]);

  const loadSentEvaluations = useCallback(() => {
    if (!(internList && internList.length)) {
      setSentEvaluations({});
      return;
    }

    function addEvaluation(evaluation) {
      setSentEvaluations((prevState) =>
        prevState[evaluation.internshipId]
          ? prevState
          : { ...prevState, [evaluation.internshipId]: evaluation }
      );
    }

    internList.forEach(async (item) => {
      if (item.evaluationId) {
        getDoc(doc(db, 'send-evaluation', item.evaluationId)).then((evaDoc) => {
          const { form, ...evaData } = evaDoc.data();
          addEvaluation(evaData);
        });
      }
    });
  }, [internList]);

  useEffect(() => loadSentEvaluations(), [loadSentEvaluations]);

  const remarksMap = useMemo(() => {
    if (!userData) return new Map();
    const remarksMap = new Map();
    const internships = Object.entries(userData.interns).map(
      ([key, value]) => key
    );
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

  async function updateInternData(internshipId, update) {
    const {
      careerId,
      employerEvaluated,
      evaluationId,
      studentId,
      evaluationTime
    } = getInternData(internshipId);
    await updateEmployer({
      [`interns.${internshipId}`]: {
        careerId,
        employerEvaluated,
        evaluationId,
        studentId,
        evaluationTime,
        ...update
      }
    });
  }

  useEffect(() => setLoaded(!!internList), [internList]);

  return (
    <EmployerContext.Provider
      value={{
        employerLoaded,
        userData,
        internList,
        remarksMap,
        evaluationForms,
        sentEvaluations,
        addRemark,
        getInternData,
        updateInternData
      }}>
      {children}
    </EmployerContext.Provider>
  );
}
