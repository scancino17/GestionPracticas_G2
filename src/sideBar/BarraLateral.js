
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/core/styles';
import ListAltIcon from '@material-ui/icons/ListAlt';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';

const useStyles = makeStyles((theme) => ({
  deleteIcon1: {
    '& svg': {
      fontSize: 25
    }
  },
  deleteIcon2: {
    '& svg': {
      fontSize: 50
    }
  },
  deleteIcon3: {
    '& svg': {
      fontSize: 75
    }
  },
  deleteIcon4: {
    '& svg': {
      fontSize: 100
    }
  }
}));

const items = [
  {
    label: 'Inscripción Pendiente',
    icon: <ArchiveIcon style={{ color: 'inherit' }} />,
    path: '/applications'
  },
  {
    label: 'Inscripciones Aprobadas',
    icon: <ListAltIcon style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Administrar Encargados',
    icon: <GroupIcon style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Evaluar Prácticas',
    icon: <AssignmentIcon style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Importar Alumnos',
    icon: <PublishIcon style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Editar Formulario',
    icon: <DescriptionIcon style={{ color: 'inherit' }} />,
    path: '/wip'
  }
];



function BarraLateralM(){
  const classes = useStyles();
  const [open,setOpen] = useState(false);
  return(
    <div>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        onClick={()=> setOpen(true)}
        className={classes.deleteIcon2}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        
        open={open}
        onClose={()=>setOpen(false)}
        onOpen={()=>{}}
      >
        <div>
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
                      style={{ backgroundColor: 'transparent' }}
                      startIcon={item.icon}>
                        {item.label}
                    </Button>
                  </ListItem>
                </Link>
              </>
            ))}
          </List>
          
        </div>
      </SwipeableDrawer>  
    </div>
  );
}
export default BarraLateralM;
