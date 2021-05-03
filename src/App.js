import React from 'react';
import './App.css';
import Landing from './login/Landing';
import { Box, Button, Grommet, Header, Image, Menu, Spinner } from 'grommet';
import { BrowserRouter as Router } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';

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
  const { user, logout } = useAuth();
  return (
    <Grommet theme={theme} full>
      <Router>
        {user ? (
          <>
            <Header background='brand' elevation='medium'>
              <Button
                icon={
                  <Box height='xxsmall'>
                    <Image fill='vertical' src='logo.png' />
                  </Box>
                }
              />
              <Menu
                label='Cuenta'
                items={[{ label: 'Cerrar sesión', onClick: logout }]}
              />
            </Header>
            {user.student || user.admin ? (
              user.student ? (
                <DashboardEstudiante />
              ) : (
                <DashboardAdmin />
              )
            ) : (
              <Box align='center'>
                <Spinner margin='medium' size='large' />
              </Box>
            )}
          </>
        ) : (
          <Landing />
        )}
      </Router>
    </Grommet>
  );
}

export default App;
