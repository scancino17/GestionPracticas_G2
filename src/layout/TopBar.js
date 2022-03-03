import {
  AppBar,
  Badge,
  Hidden,
  Box,
  Divider,
  ListItemIcon,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography
} from '@material-ui/core';
import LogoutIcon from '@mui/icons-material/Logout';
import { AccountCircle, Notifications } from '@material-ui/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  useUser,
  STUDENT_ROLE,
  ADMIN_ROLE,
  SUPERVISOR_ROLE
} from '../providers/User';
import MenuIcon from '@material-ui/icons/Menu';
import MuiAlert from '@material-ui/lab/Alert';
import NotificationMenu from './NotificationMenu';
import PasswordIcon from '@mui/icons-material/Password';
const useStyles = makeStyles((theme) => ({
  logoAdmin: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem',

    '@media (max-width: 370px)': {
      maxHeight: '3.5rem'
    },
    '@media (max-width: 345px)': {
      maxHeight: '3rem'
    },
    '@media (max-width: 320px)': {
      maxHeight: '2.7rem'
    },
    '@media (max-width: 300px)': {
      maxHeight: '2.4rem'
    },
    '@media (max-width: 280px)': {
      maxHeight: '0rem'
    }
  },
  logoStudent: {
    maxHeight: '4rem',

    '@media (max-width: 370px)': {
      maxHeight: '3.5rem'
    },
    '@media (max-width: 345px)': {
      maxHeight: '3rem'
    },

    '@media (max-width: 340px)': {
      maxHeight: '0rem'
    }
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
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant='body1' noWrap>
          {func.nombre}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
          {func.email}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={func.handleResetPassword}>
        <ListItemIcon>
          <PasswordIcon fontSize='small' />
        </ListItemIcon>
        Cambiar Contraseña
      </MenuItem>
      <MenuItem onClick={func.handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize='small' />
        </ListItemIcon>
        Cerrar sesión
      </MenuItem>
    </>
  );
};

function TopBar({ setSidebarOpen }) {
  const classes = useStyles();
  const { user, logout, resetPassword, userData, userRole } = useUser();
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
          handleLogout: handleLogout,
          nombre: user && user.displayName,
          email: user.email
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
            {(userRole === ADMIN_ROLE || userRole === SUPERVISOR_ROLE) && (
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
            <img
              className={
                userRole === STUDENT_ROLE
                  ? classes.logoStudent
                  : classes.logoAdmin
              }
              src='/logo5b-utal.png'
              alt='logo'
            />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          {userRole === STUDENT_ROLE && (
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
      {userRole !== STUDENT_ROLE && (
        <Toolbar>
          <IconButton
            disableRipple
            onClick={() => navigate('/')}
            style={{ backgroundColor: 'transparent' }}>
            <img
              className={classes.logoAdmin}
              src='/logo5b-utal.png'
              alt='logo'
            />
          </IconButton>
        </Toolbar>
      )}
      {renderMenu}
      {renderResetPasswordSnackbar}
    </>
  );
}

export default TopBar;
