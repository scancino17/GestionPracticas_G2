import React from 'react';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { Drawer, Hidden, makeStyles, Toolbar } from '@material-ui/core';
import PollIcon from '@material-ui/icons/Poll';
import ListAltIcon from '@material-ui/icons/ListAlt';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.primary.main
  },
  drawer: {
    width: 260,
    flexShrink: 0
  }
}));

const items = [
  {
    label: 'Dashboard',
    icon: <PollIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/'
  },
  {
    label: 'Intenciones de práctica',
    icon: <ArchiveIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/internship-intention'
  },
  {
    label: 'Postulaciones de práctica',
    icon: <ListAltIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/applications'
  },
  {
    label: 'Estudiantes para seguro',
    icon: <LocalHospitalIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/insurance-list'
  },

  {
    label: 'Evaluar Prácticas',
    icon: <AssignmentIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/internship-evaluation'
  },
  {
    label: 'Editar Formulario',
    icon: <DescriptionIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/edit-form'
  },
  {
    label: 'Ajustes por carrera',
    icon: <SettingsIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/careers-settings'
  },
  {
    label: 'Importar Alumnos',
    icon: <PersonAddIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/import'
  },
  {
    label: 'Administrar Encargados',
    icon: <GroupIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/supervisor-management'
  }
];

const drawer = (
  <List>
    {items.map((item) => (
      <Link
        style={{
          color: 'inherit',
          textDecoration: 'none',
          margin: '10px 0 0 10px'
        }}
        to={item.path}>
        <ListItem button>
          <Button
            disableRipple
            style={{
              backgroundColor: 'transparent',
              fontSize: 12,
              color: '#ffffff'
            }}
            startIcon={item.icon}>
            {item.label}
          </Button>
        </ListItem>
      </Link>
    ))}
  </List>
);

function BarraLateral({ sidebarOpen, setSidebarOpen }) {
  const classes = useStyles();
  return (
    <>
      <Hidden mdUp>
        <SwipeableDrawer
          classes={{ paper: classes.paper }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => {}}>
          {drawer}
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          classes={{ paper: classes.paper }}
          variant='permanent'
          open>
          <Toolbar />
          {drawer}
        </Drawer>
      </Hidden>
    </>
  );
}

export default BarraLateral;
