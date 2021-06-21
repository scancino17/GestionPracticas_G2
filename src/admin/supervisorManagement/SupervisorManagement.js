import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';

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
        <Typography variant='h4'>Ajustes por carrera</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid container direction='column' spacing={2}>
          <Grid
            item
            container
            justify='flex-end'
            alignItems='center'
            spacing={4}>
            <Grid item></Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

export default SupervisorManagement;
