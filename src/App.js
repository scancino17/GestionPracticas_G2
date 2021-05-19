import React from 'react';
import './App.css';
import Landing from './login/Landing';
import { Box, Button, Header, Image, Spinner } from 'grommet';
import { useHistory } from 'react-router-dom';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';
import {
  AppBar,
  createMuiTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar
} from '@material-ui/core';
import TopBar from './layout/TopBar';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6782bc',
      main: '#36568c',
      dark: '#002e5e',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ffc057',
      main: '#f28f25',
      dark: '#ba6100',
      contrastText: '#000000'
    }
  }
});

function App() {
  const { user, userData, logout } = useAuth();
  let history = useHistory();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <>
          <TopBar />
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
    </ThemeProvider>
  );
}

export default App;
