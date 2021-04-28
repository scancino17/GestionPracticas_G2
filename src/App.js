import React from 'react';
import './App.css';
import Landing from './login/Landing';
import Estudiante from './dashboard-estudiante/Estudiante';
import { Grommet } from 'grommet';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './providers/Auth';

const theme = {
  global: {
    colors: {
      brand: '#f4971a',
      focus: '#000000'
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px'
    }
  }
};

function App() {
  const { currentUser: user } = useAuth();
  return (
    <Grommet theme={theme} full>
      <Router>{user ? <Estudiante /> : <Landing />}</Router>
    </Grommet>
  );
}

export default App;
