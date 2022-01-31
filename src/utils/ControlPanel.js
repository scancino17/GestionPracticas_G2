import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper
} from '@material-ui/core';
import { httpsCallable } from 'firebase/functions';
import React, { useState } from 'react';
import { functions } from '../firebase';
import { useSupervisor } from '../providers/Supervisor';

function RestoreStudentPanel() {
  const [restoreEmail, setRestoreEmail] = useState('');
  const { resetStudent } = useSupervisor();

  function handleRestoreSubmit(event) {
    event.preventDefault();
    resetStudent(restoreEmail);
    setRestoreEmail('');
  }

  return (
    <Grid
      conatiner
      direction='column'
      alignItems='center'
      spacing={3}
      style={{ paddingTop: '2rem' }}>
      <Grid item container xs={12}>
        <Paper>
          <Typography variant='h4' style={{ margin: '2rem' }}>
            Restaurar estudiante
          </Typography>
          <Typography style={{ margin: '2rem' }}>
            La siguiente opción permite restaurar un estudiante a su estado
            original. Cuidado: la opción es experimental, y eliminará todas las
            aplicaciones del estudiante. Es posible que también altere el orden
            de las prácticas. Esto no debería alterar significativamente el
            funcionamiento del sistema.
          </Typography>
          <Grid
            item
            container
            direction='row'
            spacing={1}
            alignItems='center'
            style={{ margin: '2rem' }}>
            <Grid item xs={9}>
              <TextField
                label='Correo del estudiante'
                value={restoreEmail}
                fullWidth
                onChange={(e) => setRestoreEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '1rem', marginLeft: '1rem' }}
                disabled={restoreEmail === ''}
                onClick={handleRestoreSubmit}>
                Restaurar estudiante
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

function CreateEmployerPanel() {
  const [employerEmail, setEmployerEmail] = useState('');
  const [employerName, setEmployerName] = useState('');

  function handleCreateSubit(event) {
    event.preventDefault();
    const createEmployer = httpsCallable(functions, 'createEmployer');
    createEmployer({ email: employerEmail, name: employerName });
    setEmployerEmail('');
    setEmployerName('');
  }

  return (
    <Grid
      conatiner
      direction='column'
      alignItems='center'
      spacing={3}
      style={{ paddingTop: '2rem' }}>
      <Grid item container xs={12}>
        <Paper>
          <Typography variant='h4' style={{ margin: '2rem' }}>
            Crear Supervisor Empleador
          </Typography>
          <Typography style={{ margin: '2rem' }}>
            La siguiente opción permite crear una cuenta de supervisor empleador
            con fines de prueba. Cuidado, la opción es experimental, y no estará
            relacionado a ningún estudiante.
          </Typography>
          <Grid
            item
            container
            direction='row'
            spacing={1}
            alignItems='center'
            alignContent='stretch'
            style={{ margin: '2rem' }}>
            <Grid item xs={4}>
              <TextField
                label='Correo del empleador'
                value={employerEmail}
                fullWidth
                onChange={(e) => setEmployerEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Nombre del empleador'
                value={employerName}
                fullWidth
                onChange={(e) => setEmployerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '1rem', marginLeft: '1rem' }}
                disabled={employerEmail === '' && employerName === ''}
                onClick={handleCreateSubit}>
                Crear Empleador
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ControlPanel() {
  return (
    <Container>
      <RestoreStudentPanel />
      <CreateEmployerPanel />
    </Container>
  );
}

export default ControlPanel;
