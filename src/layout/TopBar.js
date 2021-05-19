import {
  AppBar,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import useAuth from '../providers/Auth';
import MenuIcon from '@material-ui/icons/Menu';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles({
  logo: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem'
  },
  icon: {
    '& svg': {
      fontSize: 40
    }
  }
});

function TopBar({ setSidebarOpen }) {
  const classes = useStyles();
  const { user, logout, resetPassword } = useAuth();
  const [anchorEl, setAnchorEl] = useState();
  const history = useHistory();
  const isMenuOpen = Boolean(anchorEl);
  const [resetPasswordSnack, setResetPasswordSnack] = useState();

  function handleProfileMenuOpen(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLogout() {
    logout();
    history.push('/');
    handleMenuClose();
  }

  function handleResetPassword() {
    resetPassword(user.email);
    setResetPasswordSnack(true);
    handleMenuClose();
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleResetPassword}>Cambiar contraseña</MenuItem>
      <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
    </Menu>
  );

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const renderResetPasswordSnackbar = (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={resetPasswordSnack}
      autoHideDuration={7000}
      onClose={() => setResetPasswordSnack(false)}
      message='Se ha enviado un correo con las instrucciones para
      restablecimiento de contraseña'>
      <Alert severity='success'>
        Se ha enviado un correo con las instrucciones para reestablecer su
        contraseña.
      </Alert>
    </Snackbar>
  );

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          {!user.student && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={() => setSidebarOpen((prevState) => !prevState)}
              className={classes.icon}>
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            disableRipple
            onClick={() => history.push('/')}
            style={{ backgroundColor: 'transparent' }}>
            <img className={classes.logo} src='logo5b.png' alt='logo' />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            onClick={handleProfileMenuOpen}
            color='inherit'
            className={classes.icon}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderResetPasswordSnackbar}
    </>
  );
}

export default TopBar;
