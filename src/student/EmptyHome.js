import React, { useState } from 'react';
import EmptyHomeModal from './extras/EmptyHomeModal';
import { Button, Container, Grid, Hidden, Typography } from '@material-ui/core';

function EmptyHome({ practicas }) {
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal((prev) => !prev);

  return (
    <Container style={{ padding: '6rem' }}>
      <Grid
        container
        direction='column'
        spacing={2}
        justifyContent='center'
        alignItems='center'>
        <Grid item>
          <Hidden xsDown>
            <img width='300' src='EmptyState-2x.png' alt='No internships' />
          </Hidden>
        </Grid>
        <Grid item container direction='column' alignItems='center'>
          <Typography variant='h6'>
            No tienes prácticas programadas de momento.
          </Typography>
          <Typography variant='body2' color='textSecondary'>
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
        open={basicModal}
        onClose={toggleShow}
        practicas={practicas}
      />
    </Container>
  );
}

export default EmptyHome;
