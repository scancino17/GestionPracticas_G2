import { Box, Button, Card, CardBody, Heading, List, Text } from 'grommet';
import { FormNext } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../../../firebase';

function ApplicationsList({ applications }) {
  return (
    <Box pad='xlarge'>
      <Heading>Solicitudes a practica</Heading>
      <AddApplication />
      <List border={false} data={applications}>
        {(application) => <ApplicationItem application={application} />}
      </List>
    </Box>
  );
}

function ApplicationItem({ application }) {
  let history = useHistory();

  let practicaColorStatus = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'status-ok';
      case 'Rechazado':
        return 'status-error';
      case 'En revisión':
        return 'status-warning';
      default:
        return 'status-unknown';
    }
  };

  return (
    <Box
      round='small'
      hoverIndicator={{ elevation: 'medium' }}
      onClick={() => {
        history.push(`/applications/${application.id}`);
      }}>
      <Card pad='medium'>
        <CardBody align='center' direction='row' justify='between'>
          <Box>
            <Text>{`Solicitud de Práctica ${application.applicationNumber}`}</Text>
            <Text>{application.companyName}</Text>
            <Card
              pad='small'
              background={practicaColorStatus(application.status)}>
              <CardBody>{application.status}</CardBody>
            </Card>
          </Box>
          <Box pad='small'>
            <Button icon={<FormNext />} />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

function AddApplication() {
  let history = useHistory();
  const { studentId, internshipId } = useParams();
  return (
    <Box
      round='small'
      margin='medium'
      hoverIndicator={{ elevation: 'medium' }}
      onClick={() => history.push(`/form/${studentId}/${internshipId}`)}>
      <Card pad='medium'>
        <CardBody direction='row' justify='between'>
          <Text margin='small' weight='bold' color='brand'>
            Agregar nueva solicitud de practica
          </Text>
          <Box pad='small'>
            <FormNext />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

function StudentApplications() {
  const { internshipId } = useParams();
  const [applications, setApplications] = useState();

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
