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

  const value = { user, userData, login, logout };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut().then(() => setUserData(null));
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        user.getIdTokenResult().then((token) => {
          setUser((prevState) => ({
            ...prevState,
            student: token.claims.student,
            admin: token.claims.admin
          }));
        });

        db.collection('users')
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUserData(doc.data());
          });
      }
    });
    setLoaded(true);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {loaded && children}
    </AuthContext.Provider>
  );
}

export default useAuth;
