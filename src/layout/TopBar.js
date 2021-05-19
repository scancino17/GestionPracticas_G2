import { AppBar, IconButton, Menu, MenuItem, Toolbar } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import useAuth from '../providers/Auth';

function TopBar() {
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
            <img src='logo.png' alt='logo' />
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
