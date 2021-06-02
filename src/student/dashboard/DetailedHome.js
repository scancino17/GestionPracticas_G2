import React from 'react';
import ToDoList from './extras/ToDoList';
import Stories from './extras/Stories';
import { Container, Grid } from '@material-ui/core';

function DetailedHome({ done }) {
  return (
    <Container style={{ padding: '2rem' }}>
      <Grid container direction='column' spacing={6}>
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
