import React, { useEffect, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase';
import { sentReport } from '../../InternshipStates';
import { Skeleton } from '@material-ui/lab';

function PracticeReport({ edit }) {
  const [interships, setInternships] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('internships')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().status === sentReport) {
            list.push({ id: doc.id, ...doc.data() });
          }
        });
        setInternships(list);
      });
  }, []);

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
        {interships.map((intership) => (
          <>
            <IntershipItem intership={intership} />
            <Divider />
          </>
        ))}
      </Container>
    </Grid>
  );
}

function IntershipItem({ intership }) {
  const history = useHistory();
  const [student, setStudent] = useState('');
  const [studentId, setStudenId] = useState('');
  useEffect(() => {
    db.collection('users')
      .doc(intership.studentId)
      .get()
      .then((user) => {
        setStudent(user.data());
        setStudenId(user.id);
      });
  }, []);

  return (
    <>
      <ListItem
        button
        onClick={() =>
          history.push(`/report-evaluated/${studentId}/${intership.id}`)
        }>
        {!student && (
          <div style={{ width: '18rem' }}>
            <Skeleton />
          </div>
        )}
        {student && (
          <>
            <ListItemText primary={student.name} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() =>
                  history.push(`/report-evaluated/${studentId}/${intership.id}`)
                }>
                <NavigateNext />
              </IconButton>
            </ListItemSecondaryAction>
          </>
        )}
      </ListItem>
    </>
  );
}
export default PracticeReport;
