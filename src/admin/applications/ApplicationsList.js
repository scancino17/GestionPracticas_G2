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
import React from 'react';
import { useHistory } from 'react-router-dom';

function ApplicationsList({ applications }) {
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
  let history = useHistory();
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
            <Text>{application.name}</Text>
            <Text>{`Práctica ${application.applicationNumber}`}</Text>
            <Text>{application.companyName}</Text>
          </Box>
          <Box pad='small'>
            <Button icon={<FormNext />} />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

export default ApplicationsList;
