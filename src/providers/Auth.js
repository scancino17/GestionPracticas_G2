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

  const value = { user, userData, login, logout, resetPassword };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut().then(() => {
      setUser(null);
      setUserData(null);
    });
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        user.getIdTokenResult().then((token) => {
          setUser((prevState) => ({
            ...prevState,
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            admin: !!token.claims.admin,
            supervisor: !!token.claims.supervisor,
            student: !!token.claims.student,
            careerId: token.claims.careerId
          }));
        });

        db.collection('users')
          .doc(user.uid)
          .onSnapshot((doc) => {
            setUserData(doc.data());
          });
      }
    });
    setLoaded(true);
    return unsubscribe;
  }, []);

  useEffect(() => {
    user
      ? console.log(user.uid, user.displayName, user)
      : console.log('descargado');
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      {loaded && children}
    </AuthContext.Provider>
  );
}

export default useAuth;
