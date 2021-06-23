import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import SupervisorTable from './SupervisorTable';

function SupervisorManagement() {
  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Import.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Administrar encargados</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <SupervisorTable />
      </Container>
    </Grid>
  );
}

export default SupervisorManagement;
