import React, { useEffect, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  List
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';
import { sentReport } from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import useAuth from '../../providers/Auth';

function ReportsList() {
  const [name, setName] = useState('');
  const [careerId, setCareerId] = useState('general');
  const [internships, setInternships] = useState([]);
  const [filterInterships, setFilterInternships] = useState([]);
  const { user } = useAuth();

  function applyFilter(list) {
    let filtered = [...list];

    if (careerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === careerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.name.includes(name));
    return filtered;
  }

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('internships').where('careerId', '==', user.careerId)
      : db.collection('internships');
    const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === sentReport) {
          list.push({
            id: doc.id,
            name: data.studentName,
            careerId: data.careerId,
            ...data
          });
        }
      });

      setInternships(list);
      if (list) setFilterInternships(applyFilter(list));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (internships) setFilterInternships(applyFilter(internships));
  }, [careerId, name]);

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
        <Typography variant='h4'>Evaluar informes de práctica</Typography>
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
          {!user.careerId && (
            <Grid item>
              <CareerSelector careerId={careerId} setCareerId={setCareerId} />
            </Grid>
          )}
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        <List>
          {filterInterships.map((intership) => (
            <>
              <ReportItem intership={intership} />
              <Divider />
            </>
          ))}
        </List>
      </Container>
    </Grid>
  );
}

function ReportItem({ intership }) {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() =>
        history.push(
          `/internship-assessment/${intership.studentId}/${intership.id}`
        )
      }>
      <ListItemText primary={intership.name} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            history.push(
              `/internship-assessment/${intership.studentId}/${intership.id}`
            )
          }>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ReportsList;
