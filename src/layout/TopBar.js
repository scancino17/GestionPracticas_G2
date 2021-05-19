import {
  AppBar,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import useAuth from '../providers/Auth';

const useStyles = makeStyles({
  logo: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem'
  }
});

function TopBar() {
  const classes = useStyles();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState();
  const history = useHistory();
  const isMenuOpen = Boolean(anchorEl);

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

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Cambiar contraseña</MenuItem>
      <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            disableRipple
            onClick={() => history.push('/')}>
            <img className={classes.logo} src='logo5b.png' alt='logo' />
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <IconButton onClick={handleProfileMenuOpen} color='inherit'>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
}

export default TopBar;
