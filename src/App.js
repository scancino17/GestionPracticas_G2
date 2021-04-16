import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import Estudiante from './dashboard-estudiante/Estudiante'
import firebase from "firebase/app";
import "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error)
    }).then(() => {
      const token = firebase.auth().currentUser.getIdTokenResult();
      console.log("Successfully logged user!")
      console.log(token);
    });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <div>
      <form>
        <label htmlFor="userEmail">
          Email:
        </label>
        <input
          type="email"
          name="userEmail"
          value={email}
          placeholder="E.g: jose123@gmail.com"
          id="userEmail"
          onChange={(event) => onChangeHandler(event)}
        />
        <label htmlFor="userPassword" className="block">
          Password:
        </label>
        <input
          type="password"
          name="userPassword"
          value={password}
          placeholder="Your password"
          id="userPassword"
          onChange={(event) => onChangeHandler(event)}
        />
        <button
          onClick={(event) => signInWithEmailAndPasswordHandler(event, email, password)}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

function App() {
  return (
    <>
      <Estudiante />
      <SignIn />
    </>
  );
}

export default App;
