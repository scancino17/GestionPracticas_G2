import {
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  makeStyles,
  Typography
} from '@material-ui/core';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  chipSuccess: {
    colorPrimary: theme.palette.success.main
  },
  chipError: {
    colorPrimary: theme.palette.error.main
  },
  chipWarning: {
    colorPrimary: theme.palette.warning.main
  },
  chipInfo: {
    colorPrimary: theme.palette.primary.light
  }
}));

function ApplicationsList({ applications }) {
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      direction='column'>
      <Typography variant='h3'>Solicitudes de práctica</Typography>
      <List>
        <AddApplication />
        {applications.map((application) => (
          <ApplicationItem application={application} />
        ))}
      </List>
    </Grid>
  );
}

function ApplicationItem({ application }) {
  let navigate = useNavigate();
  const classes = useStyles();

  let practicaColorStatus = (status) => {
    switch (status) {
      case 'Aprobada':
        return classes.chipSuccess;
      case 'Rechazado':
        return classes.chipError;
      case 'En revisión':
        return classes.chipWarning;
      default:
        return classes.chipInfo;
    }
  };

  return (
    <ListItem>
      <Grid item xs={12}>
        <Card onClick={() => navigate(`/applications/${application.id}`)}>
          <CardContent>
            <Typography variant='h4'>{`Solicitud de práctica ${application.internshipNumber}`}</Typography>
            <Typography variant='h5'>{application.companyName}</Typography>
            <Chip
              className={practicaColorStatus(application.status)}
              color='primary'
              label={application.status}
            />
          </CardContent>
        </Card>
      </Grid>
    </ListItem>
  );
}

function AddApplication() {
  let navigate = useNavigate();
  const { studentId, internshipId } = useParams();
  return (
    <ListItem>
      <Grid item xs={12}>
        <Card onClick={() => navigate(`/form/${studentId}/${internshipId}`)}>
          <CardContent>
            <Typography variant='h4' color='primary'>
              Agregar nueva solicitud de práctica
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </ListItem>
  );
}

function StudentApplications() {
  const { internshipId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    let q = query(
      collection('applications'),
      where('internshipId', '==', internshipId)
    );

    return onSnapshot(q, (querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
      setApplications(temp);
    });
  }, [internshipId]);

  return <ApplicationsList applications={applications} />;
}

export default StudentApplications;
