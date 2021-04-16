import React, { useContext } from "react";
import './App.css';
import Landing from './login/Landing';
import Estudiante from './dashboard-estudiante/Estudiante';
import "firebase/auth";
import { UserContext } from "./providers/UserProvider";

function App() {
  const user = useContext(UserContext);
  return (
    user ? <Estudiante /> : <Landing />
  );
}

export default App;
