import React from 'react';
import './App.css';
import Landing from './login/Landing';
import { Grommet } from 'grommet';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './providers/Auth';
import DashboardEstudiante from './dashboard-estudiante/DashboardEstudiante';

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
  const { user } = useAuth();
  return (
    <Grommet theme={theme} full>
      <Router>{user ? <DashboardEstudiante /> : <Landing />}</Router>
    </Grommet>
  );
}

export default App;
