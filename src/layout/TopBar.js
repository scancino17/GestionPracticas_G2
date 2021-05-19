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
import MenuIcon from '@material-ui/icons/Menu';
import { User } from 'grommet-icons';

const useStyles = makeStyles({
  logo: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem'
  }
});

function TopBar({ setSidebarOpen }) {
  const classes = useStyles();
  const { user, logout } = useAuth();
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
          {!user.student && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={() => setSidebarOpen((prevState) => !prevState)}
              className={classes.deleteIcon2}>
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
