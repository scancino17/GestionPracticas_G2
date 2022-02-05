import React from 'react';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { Badge, Drawer, Hidden, makeStyles, Toolbar } from '@material-ui/core';
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
import { ADMIN_ROLE, useUser } from '../providers/User';
import { useLocation } from 'react-router-dom';
import { Feedback } from '@material-ui/icons';
import { useSupervisor } from '../providers/Supervisor';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.primary.main
  },
  drawer: {
    width: 300,
    flexShrink: 0
  }
}));

function BarraLateral({ sidebarOpen, setSidebarOpen }) {
  const classes = useStyles();
  const { remarkList } = useSupervisor();

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
      label: 'Inscripciones de práctica',
      icon: <ListAltIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/applications'
    },
    {
      label: 'Seguro de estudiantes',
      icon: <LocalHospitalIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/insurance-list',
      adminOnly: true
    },
    {
      label: 'Evaluar Prácticas',
      icon: <AssignmentIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/internship-assessment'
    },
    {
      label: 'Observaciones de supervisores',
      icon: (
        <Badge color='secondary' badgeContent={remarkList.length}>
          <Feedback style={{ color: 'inherit', fontSize: 27 }} />
        </Badge>
      ),
      path: 'employer-remarks'
    },
    {
      label: 'Extensión de Prácticas',
      icon: <AddAlarmIcon style={{ color: 'inherit', fontSize: 27 }} />,
      path: '/extension-list'
    },
    {
      label: 'Edición Formulario de Inscripción',
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
          onClick={() => setSidebarOpen((prevState) => !prevState)}
          onClose={() => setSidebarOpen((prevState) => !prevState)}
          onOpen={() => setSidebarOpen((prevState) => !prevState)}>
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

function SidebarItems({ items, setSidebarOpen }) {
  const { userRole } = useUser();
  const location = useLocation();

  return (
    <List>
      {items.map(
        (item, index) =>
          (userRole === ADMIN_ROLE || !item.adminOnly) && (
            <Link
              key={index}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                margin: '10px 0 0 10px'
              }}
              to={item.path}>
              <ListItem
                key={index}
                button
                selected={
                  (item.path === '/' && location.pathname === '/') ||
                  (item.path !== '/' && location.pathname.includes(item.path))
                }>
                <Button
                  key={index}
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
