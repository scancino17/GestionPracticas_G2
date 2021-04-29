import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [loaded, setLoaded] = useState(false);
  const [role, setRole] = useState();

  const value = { user, userData, role, login, logout };

  function login(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user
          .getIdTokenResult()
          .then((token) => setRole(token.claims.student));
        db.collection('users')
          .doc(userCredential.user.uid)
          .get()
          .then((doc) => {
            setUserData(doc.data());
          });
      });
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    setLoaded(true);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {loaded && children}
    </AuthContext.Provider>
  );
}
