import {
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

function ApplicationsList({ applications }) {
  return (
    <Container>
      <Typography variant='h4' style={{ marginTop: '4rem' }}>
        Postulaciones de práctica pendientes
      </Typography>
      <List>
        {applications.map((application) => (
          <>
            <ApplicationItem application={application} />
            <Divider />
          </>
        ))}
      </List>
    </Container>
  );
}

function ApplicationItem({ application }) {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() => history.push(`/applications/${application.id}`)}>
      <ListItemText
        primary={application.name}
        secondary={`Práctica ${application.applicationNumber} - ${application.companyName}`}
      />
      <ListItemSecondaryAction>
        <IconButton disableRipple>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ApplicationsList;
