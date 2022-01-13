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
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { sentReport } from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import useAuth from '../../providers/Auth';

function ReportsList() {
  const [name, setName] = useState('');
  const [careerId, setCareerId] = useState('general');
  const [internships, setInternships] = useState([]);
  const [filterInternships, setFilterInternships] = useState([]);
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
    const unsubscribe = dbRef
      .where('status', '==', sentReport)
      .orderBy('creationDate', 'desc')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.studentName,
            careerId: data.careerId,
            ...data
          });
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
        <Grid container justifyContent='flex-end' alignItems='center' spacing={4}>
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
        {filterInternships && filterInternships.length > 0 ? (
          <List>
            {filterInternships.map((internship) => (
              <>
                <ReportItem internship={internship} />
                <Divider />
              </>
            ))}
          </List>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justifyContent='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img src='evaluate.png' width='300' />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay informes de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

function ReportItem({ internship }) {
  const navigate = useNavigate();

  return (
    <ListItem
      button
      onClick={() =>
        navigate(
          `/internship-assessment/${internship.studentId}/${internship.id}`
        )
      }>
      <ListItemText
        primary={internship.name}
        secondary={internship.applicationData.Empresa}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            navigate(
              `/internship-assessment/${internship.studentId}/${internship.id}`
            )
          }>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ReportsList;
