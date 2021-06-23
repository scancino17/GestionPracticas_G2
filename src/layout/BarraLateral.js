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
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import useAuth from '../providers/Auth';
const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.primary.main
  },
  drawer: {
    width: 260,
    flexShrink: 0
  }
}));

function BarraLateral({ sidebarOpen, setSidebarOpen }) {
  const classes = useStyles();

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
      path: '/insurance-list',
      adminOnly: true
    },
    {
      label: 'Evaluar Prácticas',
      icon: <AssignmentIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/internship-evaluation'
    },
    {
      label: 'Extensión de Prácticas',
      icon: <AddAlarmIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/extension-list'
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
      path: '/import',
      adminOnly: true
    },
    {
      label: 'Administrar Encargados',
      icon: <GroupIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/supervisor-management',
      adminOnly: true
    }
  ];

  return (
    <>
      <Hidden mdUp>
        <SwipeableDrawer
          classes={{ paper: classes.paper }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => {}}>
          <SidebarItems items={items} />
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          classes={{ paper: classes.paper }}
          variant='permanent'
          open>
          <Toolbar />
          <SidebarItems items={items} />
        </Drawer>
      </Hidden>
    </>
  );
}

function SidebarItems({ items }) {
  const { user } = useAuth();

  return (
    <List>
      {items.map(
        (item) =>
          (user.admin || !item.adminOnly) && (
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
          )
      )}
    </List>
  );
}

export default BarraLateral;
