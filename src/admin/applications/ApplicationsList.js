import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import { FormNext } from 'grommet-icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

function ApplicationsList({ applications }) {
  return (
    <Container>
      <Typography variant='h4'>Postulaciones de práctica pendientes</Typography>
      <List>
        {applications.map((application) => (
          <ListItem>
            <ApplicationItem application={application} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

function ApplicationItem({ application }) {
  let history = useHistory();
  return (
    <Grid
      container
      onClick={() => {
        history.push(`/applications/${application.id}`);
      }}>
      <Grid item container direction='column'>
        <Typography>{application.name}</Typography>
        <Typography>{`Práctica ${application.applicationNumber}`}</Typography>
        <Typography>{application.companyName}</Typography>
      </Grid>
      <Grid item>
        <Button icon={<FormNext />} />
      </Grid>
    </Grid>
  );
}

export default ApplicationsList;
