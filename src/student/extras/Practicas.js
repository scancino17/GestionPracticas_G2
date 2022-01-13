import React from 'react';
import { Grid, Hidden, Typography } from '@material-ui/core';
import WorkIcon from '@material-ui/icons/Work';
import StudentIntention from './StudentIntentionButton';

function Practicas({ practicas }) {
  return (
    <Grid direction='column' style={{ width: '100%' }}>
      {practicas.map((practica) => (
        <Practica practica={practica} />
      ))}
    </Grid>
  );
}

function Practica({ practica }) {
  return (
    <Grid
      container
      alignItems='center'
      justifyContent='space-between'
      wrap='nowrap'
      spacing={1}>
      <Grid item container spacing={1}>
        <Grid item>
          <Hidden smDown>
            <WorkIcon />
          </Hidden>
        </Grid>
        <Grid item>
          <Typography variant='h6'>{`Práctica ${practica.internshipNumber}`}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <StudentIntention practica={practica} />
      </Grid>
    </Grid>
  );
}

export default Practicas;
