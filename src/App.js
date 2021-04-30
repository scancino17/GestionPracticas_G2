import React, { useState } from 'react';
import './App.css';
import Landing from './login/Landing';
import { Box, Grommet, Spinner } from 'grommet';
import { BrowserRouter as Router } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './dashboard-estudiante/DashboardEstudiante';
import DashboardAdmin from './dashboad-admin/DashboardAdmin';

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
  if (user) console.log('student', user.student, 'admin', user.admin);
  return (
    <Grommet theme={theme} full>
      <Router>
        {user ? (
          user.student || user.admin ? (
            user.student ? (
              <DashboardEstudiante />
            ) : (
              <DashboardAdmin />
            )
          ) : (
            <Box align='center'>
              <Spinner margin='medium' size='large' />
            </Box>
          )
        ) : (
          <Landing />
        )}
      </Router>
    </Grommet>
  );
}

export default App;
