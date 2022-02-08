import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import SupervisorTable from './SupervisorTable';

function SupervisorManagement() {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        style={{
          backgroundImage: "url('AdminBanner-Import.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography component={'span'} variant='h4'>
          Administrar encargados
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Container style={{ marginTop: '2rem' }}>
          <SupervisorTable />
        </Container>
      </Grid>
    </Grid>
  );
}

export default SupervisorManagement;
