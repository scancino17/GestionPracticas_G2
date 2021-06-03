import React, { useState } from 'react';
import './App.css';
import Landing from './login/Landing';
import useAuth from './providers/Auth';
import DashboardEstudiante from './student/dashboard/DashboardEstudiante';
import DashboardAdmin from './admin/dashboard/DashboardAdmin';
import {
  CircularProgress,
  createMuiTheme,
  CssBaseline,
  darken,
  Grid,
  ThemeProvider
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
  }
});

function App() {
  const { user, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <>
          <TopBar setSidebarOpen={setSidebarOpen} />
          {(user.student || user.admin) && userData ? (
            user.student ? (
              <DashboardEstudiante onGoingIntern={false} />
            ) : (
              <DashboardAdmin sidebarProps={{ sidebarOpen, setSidebarOpen }} />
            )
          ) : (
            <Grid
              container
              justify='center'
              alignItems='center'
              direction='row'>
              <CircularProgress color='secondary' />
            </Grid>
          )}
        </>
      ) : (
        <Landing />
      )}
    </ThemeProvider>
  );
}

export default App;
