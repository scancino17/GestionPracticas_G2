import React, { useState } from 'react';
import EmptyHomeModal from './extras/EmptyHomeModal';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './extras/Student.css';
import { Button, Grid, Hidden, Typography } from '@material-ui/core';

function EmptyHome({ practicas }) {
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);

  return (
    <>
      <Grid container direction='column' spacing={1} alignItems='center'>
        <Grid item>
          <Hidden xsDown>
            <img
              width='300'
              height='220'
              src='EmptyState-2x.png'
              alt='No internships'
            />
          </Hidden>
          <Typography variant='h6'>
            No tienes prácticas programadas de momento.
          </Typography>
          <Typography variant='p' color='textSecondary'>
            Declara tu práctica y cosas mágicas pasarán ;)
          </Typography>
        </Grid>
        <Grid item>
          <Button variant='outlined' color='primary' onClick={toggleShow}>
            Declarar Práctica
          </Button>
        </Grid>
      </Grid>
      <EmptyHomeModal
        show={basicModal}
        close={toggleShow}
        setModal={setBasicModal}
        practicas={practicas}
      />
    </>
  );
}

export default EmptyHome;
