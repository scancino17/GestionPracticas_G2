import {
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';

function ApplicationsList() {
  const [careers, setCareers] = useState([]);
  const [careerId, setCareerId] = useState('general');
  const [applications, setApplications] = useState();
  const [filteredApplications, setFilteredApplications] = useState();

  useEffect(() => {
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );
        setCareers(temp);
      });
  });

  useEffect(() => {
    const unsubscribe = db
      .collection('applications')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) =>
          list.push({ id: doc.id, ...doc.data() })
        );
        setApplications(list);
        if (list) {
          const pending = list.filter((item) => item.status === 'En revisión');
          setFilteredApplications(pending);
        }
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (applications && careerId)
      setFilteredApplications(
        applications.filter(
          (item) => item.status === 'En revisión' && item.careerId === careerId
        )
      );
  }, [careerId]);

  return (
    <Container>
      <Typography variant='h4' style={{ marginTop: '3rem' }}>
        Postulaciones de práctica
      </Typography>
      <Grid container justify='flex-end' alignItems='center' spacing={4}>
        <Grid item>
          <Typography variant='h5'>Carrera:</Typography>
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel id='select-career'>Seleccionar carrera</InputLabel>
            <Select
              labelId='select-career'
              value={careerId}
              onChange={(e) => setCareerId(e.target.value)}
              style={{ minWidth: '12rem' }}>
              {careers.map((career) => {
                return (
                  <MenuItem key={career.id} value={career.id}>
                    {career.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
  );
}

function ApplicationItem({ application }) {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() => history.push(`/check-form/${application.id}`)}>
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
