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
        <Grid container direction='column' spacing={2}>
          <Grid item container justify='center' alignItems='center' spacing={4}>
            <Grid item>
              <SupervisorTable />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

export default SupervisorManagement;
