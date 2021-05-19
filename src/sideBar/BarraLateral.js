
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import ListAltIcon from '@material-ui/icons/ListAlt';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';

const styles = {
  button: {
    width: 64, height: 64,
    padding: 0,
  },
  icon: {
    width: 64, height: 64,
  },
};

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
  const [open,setOpen] = useState(false);
  return(
    <div>
      <IconButton
        edge='false'
        color='inherit'
        aria-label='open drawer'
        onClick={()=> setOpen(true)}
        style={styles.button} iconStyle={styles.icon}
      >
        <MenuIcon/>
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
