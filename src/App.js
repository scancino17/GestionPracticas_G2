import React from 'react';
import './App.css';
import Landing from './login/Landing';
import {
  DropButton,
  Box,
  Button,
  Grommet,
  Header,
  Image,
  Spinner
} from 'grommet';
import { useHistory } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';
import { Actions } from 'grommet-icons';
import { auth } from './firebase';

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

            <DropButton
              label={<Actions />}
              dropAlign={{ top: 'bottom', right: 'right' }}
              dropContent={
                <Box background='light-2' margin='4px'>
                  {userData ? (
                    <Button
                      margin='3px'
                      padding='3px 15px'
                      label='Cambiar contraseña'
                      onClick={(e) => {
                        e.preventDefault();
                        auth
                          .sendPasswordResetEmail(userData.email)
                          .then(function () {
                            // Email sent.
                          })
                          .catch(function (error) {
                            // An error happened.
                          });
                        alert(
                          'Se ha enviado un correo electronico con instrucciones para cambio de contraseña'
                        );
                      }}
                    />
                  ) : (
                    <Button></Button>
                  )}

                  <Button
                    margin='3px'
                    padding='3px 15px'
                    label='Cerrar sesión'
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      history.replace('/');
                    }}
                  />
                </Box>
              }
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
