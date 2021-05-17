import React, { useState } from 'react';
import './App.css';
import Landing from './login/Landing';
import {
  DropButton,
  Box,
  Button,
  Grommet,
  Header,
  Image,
  Spinner,
  Text,
  Layer,
  Menu
} from 'grommet';
import { useHistory } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';
import { Actions, User } from 'grommet-icons';
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
  const [show, setShow] = useState();
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
            <Menu
              dropProps={{ align: { top: 'top', right: 'right' } }}
              margin='small'
              icon={<User />}
              items={[
                {
                  label: 'Cambiar contraseña',
                  onClick: (e) => {
                    e.preventDefault();
                    auth
                      .sendPasswordResetEmail(userData.email)
                      .then(function () {
                        // Email sent.
                      })
                      .catch(function (error) {
                        // An error happened.
                      });
                    setShow(true);
                  }
                },
                {
                  label: 'Cerrar sesión',
                  onClick: (e) => {
                    e.preventDefault();
                    logout();
                    history.replace('/');
                  }
                }
              ]}
            />

            {show && (
              <Layer
                onEsc={() => setShow(false)}
                onClickOutside={() => setShow(false)}>
                <Text justify='Center' margin='medium'>
                  Se ha enviado un correo con las instrucciones para
                  restablecimiento de contraseña
                </Text>
                <Button
                  margin='medium'
                  primary
                  label='Cerrar'
                  onClick={() => setShow(false)}
                />
              </Layer>
            )}
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
