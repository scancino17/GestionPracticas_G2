import { Button } from '@material-ui/core';
import { Container, Grid, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';

function CareersSettings() {
  const [careerId, setCareerId] = useState();
  const [career, setCareer] = useState();
  const [internships, setInternships] = useState(1);

  useEffect(() => {
    if (careerId)
      db.collection('careers')
        .doc(careerId)
        .get()
        .then((doc) => {
          const data = doc.data();
          setCareer(data);
          setInternships(data.internships);
        });
  }, [careerId]);

  function handleSave() {
    db.collection('careers')
      .doc(careerId)
      .update({ internships: parseInt(internships) })
      .then(() =>
        Swal.fire(
          'Cambios guardados',
          'Los cambios han sido guardados',
          'success'
        )
      );
  }

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
            <Grid item>
              <CareerSelector
                careerId={careerId}
                setCareerId={setCareerId}
                excludeGeneral
              />
            </Grid>
          </Grid>
          {career && (
            <>
              <Grid item container alignItems='center' spacing={2}>
                <Grid item>
                  <Typography variant='h5'>Prácticas de la carrera:</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    label='Número de prácticas'
                    type='number'
                    value={internships}
                    onChange={(e) => {
                      if (e.target.value > 0) setInternships(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item>{/* Aqui debiese ir lo de la URL */}</Grid>
              <Grid item container justify='flex-end'>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSave}>
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

export default CareersSettings;
