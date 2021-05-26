import {
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../../../firebase';

function ApplicationsList({ applications }) {
  return (
    <Grid container justify='center' alignItems='center' direction='column'>
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
  let history = useHistory();

  let practicaColorStatus = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'success';
      case 'Rechazado':
        return 'error';
      case 'En revisión':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <ListItem>
      <Grid item xs={12}>
        <Card onClick={() => history.push(`/applications/${application.id}`)}>
          <CardContent>
            <Typography variant='h4'>{`Solicitud de práctica ${application.applicationNumber}`}</Typography>
            <Typography variant='h5'>{application.companyName}</Typography>
            <Chip primary label={application.status} />
          </CardContent>
        </Card>
      </Grid>
    </ListItem>
  );
}

function AddApplication() {
  let history = useHistory();
  const { studentId, internshipId } = useParams();
  return (
    <ListItem>
      <Grid item xs={12}>
        <Card
          onClick={() => history.push(`/form/${studentId}/${internshipId}`)}>
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
    db.collection('applications')
      .where('internshipId', '==', internshipId)
      .get()
      .then((querySnapshot) => {
        let temp = [];
        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );
        setApplications(temp);
      });
  });

  return <ApplicationsList applications={applications} />;
}

export default StudentApplications;
