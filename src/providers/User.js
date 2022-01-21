import React, { useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';

export const STUDENT_ROLE = 'estudiante';
export const ADMIN_ROLE = 'admin';
export const SUPERVISOR_ROLE = 'supervisor de escuela';
export const EMPLOYER_ROLE = 'supervisor empleador';
export const NO_ROLE = 'sin rol';

export const DEFAULT_CAREER = 'general';

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [userLoaded, setUserLoaded] = useState(false);

  const [displayName, setDisplayName] = useState();
  const [careerId, setCareerId] = useState();
  const [userRole, setUserRole] = useState();
  const [userId, setUserId] = useState();
  const [email, setEmail] = useState();

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth).then(() => {
      setUser(null);
      setUserData(null);
    });
  }

  function resetPassword(email) {
    sendPasswordResetEmail(auth, email);
  }

  function getRole(claims) {
    return !!claims.admin
      ? ADMIN_ROLE
      : !!claims.supervisor
      ? SUPERVISOR_ROLE
      : !!claims.student
      ? STUDENT_ROLE
      : !!claims.employer
      ? EMPLOYER_ROLE
      : NO_ROLE;
  }

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setCareerId(user.careerId);
      setUserId(user.uid);
      setUserRole(user.userRole);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    let unsubscribeDoc = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult().then((token) => {
          setUser({
            ...user,
            userRole: getRole(token.claims),
            careerId: !!token.claims.careerId
              ? token.claims.careerId
              : DEFAULT_CAREER
          });

          unsubscribeDoc = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            setUserData(doc.data());
          });
        });
      }
    });
    setUserLoaded(true);
    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        userLoaded,
        login,
        logout,
        resetPassword,
        displayName,
        careerId,
        userRole,
        userId,
        email
      }}>
      {userLoaded && children}
    </UserContext.Provider>
  );
}
