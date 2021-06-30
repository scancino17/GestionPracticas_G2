import React from 'react';
import ToDoList from './extras/ToDoList';
import Stories from './extras/Stories';
import StateBanner from './extras/StateBanner';
import { Container, Grid } from '@material-ui/core';

function DetailedHome({ done, reason }) {
  return (
    <Container style={{ padding: '2rem' }}>
      <Grid container direction='column' spacing={6}>
        {/* Statebanner tiene un grid item adentro*/}
        <StateBanner />
        <Grid item>
          <ToDoList done={done} reason={reason} />
        </Grid>
        <Grid item>
          <Stories />
        </Grid>
      </Grid>
    </Container>
  );
}
export default DetailedHome;
