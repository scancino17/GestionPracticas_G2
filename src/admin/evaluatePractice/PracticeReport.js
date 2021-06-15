import React from 'react';
import {Grid, Container, Typography} from '@material-ui/core';

function PracticeReport({ edit }) {
  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Evaluate.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Postulaciones de práctica</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
          
        
      </Container>
    </Grid>
  );
}

export default PracticeReport;