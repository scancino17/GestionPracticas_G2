import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  List,
  Main,
  Text
} from 'grommet';
import { FormNext } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';

function ApplicationsList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    db.collection('applications')
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) =>
          list.push({ id: doc.id, ...doc.data() })
        );
        setApplications(list);
      });
  }, []);

  return (
    <Main pad='xlarge'>
      <Heading>Postulaciones de práctica pendientes</Heading>
      <List border={false} data={applications}>
        {(application) => <ApplicationItem application={application} />}
      </List>
    </Main>
  );
}

function ApplicationItem({ application }) {
  return (
    <Card pad='medium'>
      <CardBody align='center' direction='row' justify='between'>
        <Box>
          <Text>{application.name}</Text>
          <Text>{`Práctica ${application.applicationNumber}`}</Text>
          <Text>{application.companyName}</Text>
        </Box>
        <Link to={`/applications/${application.id}`}>
          <Button icon={<FormNext />} />
        </Link>
      </CardBody>
    </Card>
  );
}

export default ApplicationsList;
