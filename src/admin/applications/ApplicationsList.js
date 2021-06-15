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
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';

function ApplicationsList() {
  const [careerId, setCareerId] = useState('general');
  const [applications, setApplications] = useState();
  const [filteredApplications, setFilteredApplications] = useState();
  const [name, setName] = useState('');
  const [statuses, setStatuses] = useState({
    reviewing: true,
    approved: false,
    rejected: false
  });
  const { reviewing, approved, rejected } = statuses;

  useEffect(() => {
    const unsubscribe = db
      .collection('applications')
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
    console.log(filtered);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    if (!reviewing)
      filtered = filtered.filter((item) => item.status !== 'En revisión');
    if (!approved)
      filtered = filtered.filter((item) => item.status !== 'Aprobado');
    if (!rejected)
      filtered = filtered.filter((item) => item.status !== 'Rechazado');
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
        <Typography variant='h4'>Informes de práctica</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid container justify='flex-end' alignItems='center' spacing={4}>
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
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <CareerSelector careerId={careerId} setCareerId={setCareerId} />
          </Grid>
        </Grid>
        <List>
          {filteredApplications &&
            filteredApplications.map((application) => (
              <>
                <ApplicationItem application={application} />
                <Divider />
              </>
            ))}
        </List>
      </Container>
    </Grid>
  );
}

function ApplicationItem({ application }) {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() => history.push(`/applications/${application.id}`)}>
      <ListItemText
        primary={application.studentName}
        secondary={`Práctica ${application.internshipNumber} - ${application.Empresa}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => history.push(`/applications/${application.id}`)}>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ApplicationsList;
