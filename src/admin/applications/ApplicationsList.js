import {
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';
import { useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';

function ApplicationsList() {
  const [careerId, setCareerId] = useState('general');
  const [name, setName] = useState('');
  const [statuses, setStatuses] = useState({
    reviewing: true,
    approved: false,
    rejected: false,
    needChanges: false
  });
  const { reviewing, approved, rejected, needChanges } = statuses;
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const { applications } = useSupervisor();

  const filteredApplications = useMemo(() => {
    if (applications) {
      let filtered = applications.slice();
      if (careerId !== 'general')
        filtered = filtered.filter((item) => item.careerId === careerId);
      if (name !== '')
        filtered = filtered.filter((item) => item.studentName.includes(name));
      if (!reviewing)
        filtered = filtered.filter((item) => item.status !== 'En revisión');
      if (!approved)
        filtered = filtered.filter((item) => item.status !== 'Aprobado');
      if (!rejected)
        filtered = filtered.filter((item) => item.status !== 'Rechazado');
      if (!needChanges)
        filtered = filtered.filter(
          (item) => item.status !== 'Necesita cambios menores'
        );
      return filtered;
    } else return [];
  }, [
    applications,
    careerId,
    name,
    reviewing,
    approved,
    rejected,
    needChanges
  ]);

  function handleCheckboxes(e) {
    setStatuses((prev) => {
      return { ...prev, [e.target.name]: e.target.checked };
    });
  }

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Form.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Inscripciones de práctica</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid
          container
          justifyContent='flex-end'
          alignItems='center'
          spacing={4}>
          <Grid item>
            <TextField
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={reviewing}
                      onChange={handleCheckboxes}
                      name='reviewing'
                    />
                  }
                  label='En revisión'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={approved}
                      onChange={handleCheckboxes}
                      name='approved'
                    />
                  }
                  label='Aprobadas'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rejected}
                      onChange={handleCheckboxes}
                      name='rejected'
                    />
                  }
                  label='Rechazadas'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={needChanges}
                      onChange={handleCheckboxes}
                      name='needChanges'
                    />
                  }
                  label='Necesita cambios'
                />
              </FormGroup>
            </FormControl>
          </Grid>
          {!user.careerId && (
            <Grid item>
              <CareerSelector careerId={careerId} setCareerId={setCareerId} />
            </Grid>
          )}
        </Grid>
        <List>
          {filteredApplications &&
            filteredApplications
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((application) => (
                <>
                  <ApplicationItem application={application} />
                  <Divider />
                </>
              ))}
        </List>
        <Grid container justifyContent='flex-end'>
          {filteredApplications && filteredApplications.length > 0 ? (
            <Pagination
              count={Math.ceil(filteredApplications.length / itemsPerPage)}
              page={page}
              color='primary'
              style={{ marginBottom: '40px' }}
              onChange={(_, val) => setPage(val)}
            />
          ) : (
            <Grid
              container
              direction='column'
              align='center'
              justifyContent='center'
              style={{ marginTop: '6rem' }}>
              <Grid item>
                <img
                  src='post.png'
                  width='300'
                  alt='Sin inscripciones de práctica'
                />
              </Grid>
              <Typography variant='h5' color='textSecondary'>
                No hay inscripciones de práctica disponibles
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

function ApplicationItem({ application }) {
  const navigate = useNavigate();

  return (
    <ListItem
      button
      onClick={() => navigate(`/applications/${application.id}`)}>
      <ListItemText
        primary={application.studentName}
        secondary={`${application['Rut del estudiante']} - ${application['Número de matrícula']} - Práctica ${application.internshipNumber} - ${application.careerId}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => navigate(`/applications/${application.id}`)}>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ApplicationsList;
