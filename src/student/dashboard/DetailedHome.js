import React from 'react';
import CustomStepper from './extras/CustomStepper';
import ToDoList from './extras/ToDoList';
import Stories from './extras/Stories';
import {
  Container,
  Divider,
  Grid,
  Hidden,
  Typography,
  Card
} from '@material-ui/core';

function DetailedHome({ done }) {
  return (
    <Container style={{ padding: '2rem' }}>
      <Grid container direction='column' spacing={6}>
        <Card>
          <Grid item>
            <Grid item>
              <CustomStepper />
            </Grid>
            <Divider />
            <Grid item style={{ margin: '2rem 0rem 1rem 2rem' }}>
              <Typography variant='h5'>Práctica X: Google</Typography>
              <Hidden smDown>
                <Typography color='textSecondary' variant='body2'>
                  Supervisor: Sundar Pichai · Dirección: Palo Alto, CA ·
                  Modalidad: Remoto
                </Typography>
              </Hidden>
            </Grid>
          </Grid>
        </Card>
        <Grid item>
          <ToDoList done={done} />
        </Grid>
        <Grid item>
          <Stories />
        </Grid>
      </Grid>
    </Container>
  );
}
export default DetailedHome;
