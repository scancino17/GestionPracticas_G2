import React from 'react';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

import { makeStyles, ThemeProvider } from '@material-ui/core';

import ListAltIcon from '@material-ui/icons/ListAlt';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';

const drawerWidth = 260;
const useStyles = makeStyles({
  paper: {
    background:'#36568c',
    width: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
  },
  logo: {
    // Dejar en 2.5rem para respetar tamaño appbar, dejar en 4 rem para que sea legible
    maxHeight: '4rem'
  },
  icon: {
    '& svg': {
      fontSize: 100
    }
  }
});

const items = [
  {
    label: 'Inscripción Pendiente',
    icon: <ArchiveIcon  style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/applications'
  },
  {
    label: 'Inscripciones Aprobadas',
    icon: <ListAltIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/wip'
  },
  {
    label: 'Administrar Encargados',
    icon: <GroupIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/wip'
  },
  {
    label: 'Evaluar Prácticas',
    icon: <AssignmentIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/wip'
  },
  {
    label: 'Importar Alumnos',
    icon: <PublishIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/wip'
  },
  {
    label: 'Editar Formulario',
    icon: <DescriptionIcon style={{ color: 'inherit', fontSize: 27 }} />,
    path: '/wip'
  }
];

function BarraLateral({ sidebarOpen, setSidebarOpen }) {
  const classes = useStyles();
  return (
    
    <SwipeableDrawer
      
      className={classes.drawer}
      classes={{paper: classes.paper}}
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      onOpen={() => {}}>
      <div className={classes.drawerContainer}>
      <List>
        {items.map((item) => (
          <>
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
                  style={{ backgroundColor: 'transparent',fontSize: 12, color:'#ffffff' }}
                  startIcon={item.icon}
                  size='large'>
                  {item.label}
                </Button>
              </ListItem>
            </Link>
          </>
        ))}
      </List>
      </div>
    </SwipeableDrawer>
  );
}
export default BarraLateral;
