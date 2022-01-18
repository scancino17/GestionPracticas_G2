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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';
import { useUser } from '../../providers/User';

function ApplicationsList() {
  const [careerId, setCareerId] = useState('general');
  const [applications, setApplications] = useState();
  const [filteredApplications, setFilteredApplications] = useState();
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

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('applications').where('careerId', '==', user.careerId)
      : db.collection('applications');
    const unsubscribe = dbRef
      .orderBy('creationDate', 'desc')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) =>
          list.push({ id: doc.id, ...doc.data() })
        );
        setApplications(list);
        if (list) setFilteredApplications(applyFilter(list));
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (applications) setFilteredApplications(applyFilter(applications));
  }, [careerId, name, statuses]);

  function applyFilter(list) {
    let filtered = list.slice();
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
  }

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
        <Typography variant='h4'>Postulaciones de práctica</Typography>
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
                <img src='post.png' width='300' />
              </Grid>
              <Typography variant='h5' color='textSecondary'>
                No hay postulaciones de práctica disponibles
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
        secondary={`Práctica ${application.internshipNumber} - ${application.Empresa}`}
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
