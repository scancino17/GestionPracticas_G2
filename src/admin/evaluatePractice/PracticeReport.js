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

function PracticeReport() {
  const [name, setName] = useState('');
  const [careerId, setCareerId] = useState('general');
  const [internships, setInternships] = useState([]);
  const [filterInterships, setFilterInternships] = useState([]);

  function applyFilter(list) {
    let filtered = [...list];

    if (careerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === careerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.name.includes(name));
    return filtered;
  }

  function getInfoStudent(list, id) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.id === id) {
        return { name: element.name, careerId: element.careerId };
      }
    }
  }

  useEffect(() => {
    let users = [];
    db.collection('users')
      .get()
      .then((student) =>
        student.forEach((element) => {
          const studentData = element.data();
          users.push({
            id: element.id,
            name: studentData.name,
            careerId: studentData.careerId
          });
        })
      );

    const unsubscribe = db
      .collection('internships')
      .onSnapshot((querySnapshot) => {
        let list = [];
        let info;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === sentReport) {
            info = getInfoStudent(users, data.studentId);
            list.push({
              id: doc.id,
              name: info.name,
              careerId: info.careerId,
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
        <Typography variant='h4'>Evaluar informes de prácticas</Typography>
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
            <CareerSelector careerId={careerId} setCareerId={setCareerId} />
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        <List>
          {filterInterships.map((intership) => (
            <>
              <IntershipItem intership={intership} />
              <Divider />
            </>
          ))}
        </List>
      </Container>
    </Grid>
  );
}

function IntershipItem({ intership }) {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() =>
        history.push(`/report-evaluated/${intership.studentId}/${intership.id}`)
      }>
      <ListItemText primary={intership.name} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            history.push(
              `/report-evaluated/${intership.studentId}/${intership.id}`
            )
          }>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
export default PracticeReport;
