import React from 'react';
import './App.css';
import Landing from './login/Landing';
import { Box, Button, Grommet, Header, Image, Spinner } from 'grommet';
import { useHistory } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';

const theme = {
  global: {
    colors: {
      brand: 'status-warning',
      focus: 'neutral-3'
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px'
    }
  }
};

function App() {
  const { user, userData, logout } = useAuth();
  let history = useHistory();
  return (
    <Grommet theme={theme} full>
      {user ? (
        <>
          <Header background='brand' elevation='medium'>
            <Button
              onClick={() => history.push('/')}
              icon={
                <Box height='xxsmall'>
                  <Image fill='vertical' src='logo.png' />
                </Box>
              }
            />
            <Button
              label='Cerrar sesión'
              onClick={(e) => {
                e.preventDefault();
                logout();
                history.replace('/');
              }}
            />
          </Header>
          {(user.student || user.admin) && userData ? (
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
    </Grommet>
  );
}

export default App;
