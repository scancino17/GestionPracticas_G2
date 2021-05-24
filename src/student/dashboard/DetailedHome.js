import React from 'react';
import CustomStepper from './extras/CustomStepper';
import ToDoList from './extras/ToDoList';
import Stories from './extras/Stories';
import { Container, Grid, Hidden, Typography } from '@material-ui/core';

function DetailedHome({ done }) {
  return (
    <Container style={{ padding: '2rem' }}>
      <Grid container direction='column' spacing={6}>
        <Grid item>
          <Typography variant='h4' gutterBottom>
            Práctica X: Google
          </Typography>
          <Hidden smDown>
            <Typography color='textSecondary' variant='body2'>
              Supervisor: Sundar Pichai · Dirección: Palo Alto, CA · Modalidad:
              Remoto
            </Typography>
          </Hidden>
        </Grid>
        <Grid item>
          <CustomStepper />
        </Grid>
        <Grid item>
          <ToDoList done={false} />
        </Grid>
        <Grid item>
          <Stories />
        </Grid>
      </Grid>
    </Container>
  );
}
export default DetailedHome;
