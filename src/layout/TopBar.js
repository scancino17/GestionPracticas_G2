import {
  AppBar,
  Badge,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar
} from '@material-ui/core';
import { AccountCircle, Notifications } from '@material-ui/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../providers/User';
import MenuIcon from '@material-ui/icons/Menu';
import MuiAlert from '@material-ui/lab/Alert';
import NotificationMenu from './NotificationMenu';

const useStyles = makeStyles((theme) => ({
  logo: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem'
  },
  icon: {
    '& svg': {
      fontSize: 40
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

const ProfileMenu = ({ func }) => {
  return (
    <>
      <MenuItem onClick={func.handleResetPassword}>Cambiar contraseña</MenuItem>
      <MenuItem onClick={func.handleLogout}>Cerrar sesión</MenuItem>
    </>
  );
};

function TopBar({ setSidebarOpen }) {
  const classes = useStyles();
  const { user, logout, resetPassword, userData } = useUser();
  const [anchorEl, setAnchorEl] = useState();
  const [selectedMenu, setSelectedMenu] = useState();
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const [resetPasswordSnack, setResetPasswordSnack] = useState();

  function handleProfileMenuOpen(e) {
    setAnchorEl(e.currentTarget);
    setSelectedMenu(
      <ProfileMenu
        func={{
          handleResetPassword: handleResetPassword,
          handleLogout: handleLogout
        }}
      />
    );
  }

  function handleNotificationMenuOpen(e) {
    setAnchorEl(e.currentTarget);
    setSelectedMenu(<NotificationMenu />);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setSelectedMenu(null);
  }

  function handleLogout() {
    logout();
    navigate('/');
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
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}>
      {selectedMenu}
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
      <AppBar
        position={user.student ? 'static' : 'fixed'}
        className={classes.appBar}>
        <Toolbar>
          <Hidden mdUp>
            {!user.student && (
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={() => setSidebarOpen((prevState) => !prevState)}
                className={classes.icon}>
                <MenuIcon />
              </IconButton>
            )}
          </Hidden>
          <IconButton
            disableRipple
            onClick={() => navigate('/')}
            style={{ backgroundColor: 'transparent' }}>
            <img className={classes.logo} src='logo5b-utal.png' alt='logo' />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          {user.student && (
            <IconButton
              color='inherit'
              onClick={handleNotificationMenuOpen}
              className={classes.icon}>
              <Badge
                color='secondary'
                badgeContent={
                  userData &&
                  userData.notifications &&
                  Object.entries(userData.notifications).length
                }>
                <Notifications />
              </Badge>
            </IconButton>
          )}
          <IconButton
            onClick={handleProfileMenuOpen}
            color='inherit'
            className={classes.icon}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {!user.student && (
        <Toolbar>
          <IconButton
            disableRipple
            onClick={() => navigate('/')}
            style={{ backgroundColor: 'transparent' }}>
            <img className={classes.logo} src='logo5b-utal.png' alt='logo' />
          </IconButton>
        </Toolbar>
      )}
      {renderMenu}
      {renderResetPasswordSnackbar}
    </>
  );
}

export default TopBar;
