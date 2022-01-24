import React, { useEffect, useState } from 'react';
import './App.css';
import Landing from './login/Landing';
import {
  ADMIN_ROLE,
  STUDENT_ROLE,
  SUPERVISOR_ROLE,
  useUser
} from './providers/User';
import DashboardEstudiante from './student/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';
import {
  createTheme,
  CssBaseline,
  darken,
  Grid,
  ThemeProvider
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import TopBar from './layout/TopBar';
import MakeAdmin from './utils/MakeAdmin';
import { StudentProvider } from './providers/Student';
import { SupervisorProvider } from './providers/Supervisor';

const theme = createTheme({
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
    },
    error: {
      main: '#f44336',
      dark: darken('#f44336', 0.15)
    },
    warning: {
      main: '#ff9800'
    },
    success: {
      main: '#4caf50',
      dark: darken('#4caf50', 0.15)
    }
  },
  typography: {
    h4: {
      color: '#424242'
    },
    h5: {
      color: '#424242'
    }
  }
});

function App() {
  const { user, userData, userRole } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <>
          <TopBar setSidebarOpen={setSidebarOpen} />
          {userRole === ADMIN_ROLE || userRole === SUPERVISOR_ROLE ? (
            <SupervisorProvider>
              <DashboardAdmin sidebarProps={{ sidebarOpen, setSidebarOpen }} />
            </SupervisorProvider>
          ) : userRole === STUDENT_ROLE && userData ? (
            <StudentProvider>
              <DashboardEstudiante />
            </StudentProvider>
          ) : (
            <LoadingSkeleton />
          )}
          {/* Eliminar o comentar línea siguiente una vez se haya creado un usuario administrador*/}
          {/*<MakeAdmin />*/} {/* ELIMINAR O COMENTAR ESTA LÍNEA*/}
          {/* Eliminar o comentar línea anterior una vez se haya creado un usuario administrador*/}
        </>
      ) : (
        <Landing />
      )}
    </ThemeProvider>
  );
}

function LoadingSkeleton() {
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      direction='column'
      style={{ marginTop: '4rem' }}>
      <Skeleton
        variant='rect'
        animation='wave'
        height='5rem'
        width='75%'
        style={{ marginBottom: '2rem' }}
      />
      <Skeleton animation='wave' width='75%' height='2rem' />
      <Skeleton animation='wave' width='75%' height='2rem' />
      <Skeleton animation='wave' width='75%' height='2rem' />
    </Grid>
  );
}

export default App;
