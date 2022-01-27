import { Button } from '@material-ui/core';
import {
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSupervisor } from '../../providers/Supervisor';
import { ADMIN_ROLE, useUser } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';

function CareersSettings() {
  const { userRole, careerId } = useUser();
  const [selectedCareerId, setSelectedCareerId] = useState(
    careerId ? careerId : null
  );
  const [career, setCareer] = useState();
  const [internships, setInternships] = useState(1);
  const [survey, setSurvey] = useState('');
  const { getCareerData, updateCareer } = useSupervisor();

  useEffect(() => {
    if (selectedCareerId) {
      let career = getCareerData(selectedCareerId);
      setCareer(career);
      setInternships(career.internships);
      setSurvey(career.satisfactionSurvey);
    }
  }, [selectedCareerId, getCareerData]);

  function handleSave() {
    updateCareer(selectedCareerId, {
      internships: parseInt(internships),
      satisfactionSurvey: survey
    }).then(() =>
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
          {userRole === ADMIN_ROLE && (
            <Grid
              item
              container
              justifyContent='flex-end'
              spacing={4}
              style={{ marginBottom: '1rem' }}>
              <Grid item>
                <CareerSelector
                  careerId={selectedCareerId}
                  setCareerId={setSelectedCareerId}
                  excludeGeneral
                />
              </Grid>
            </Grid>
          )}
          {career ? (
            <Grid container direction='column' spacing={4}>
              <Grid item>
                <Card>
                  <CardContent>
                    <Typography variant='h5'>
                      Prácticas de la carrera
                    </Typography>
                    <TextField
                      fullWidth
                      label='Número de prácticas'
                      type='number'
                      value={internships}
                      onChange={(e) => {
                        if (e.target.value > 0) setInternships(e.target.value);
                      }}
                      style={{ marginTop: '1rem' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardContent>
                    <Typography variant='h5'>
                      Encuesta de satisfacción
                    </Typography>
                    <TextField
                      fullWidth
                      label='URL de la encuesta'
                      value={survey}
                      onChange={(e) => {
                        setSurvey(e.target.value);
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item container justifyContent='flex-end'>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSave}>
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              direction='column'
              align='center'
              justifyContent='center'
              style={{ marginTop: '6rem' }}>
              <Grid item>
                <img
                  src='EmptyState-3x.png'
                  width='300'
                  alt='Sin carrera seleccionada'
                />
              </Grid>
              <Grid item>
                <Typography variant='h5' color='textSecondary'>
                  Selecciona una carrera para continuar
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

export default CareersSettings;
