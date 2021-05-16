import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  List
} from 'grommet';
import { FormNext } from 'grommet-icons';
import StudentIntention from './StudentIntention';

function Practicas({ practicas }) {
  return (
    <List border={false} data={practicas}>
      {(practica) => <PracticaCard practica={practica} />}
    </List>
  );
}

function PracticaCard({ practica }) {
  let history = useHistory();

  let practicaColorStatus = (status) => {
    switch (status) {
      case 'En curso':
        return 'status-ok';
      case 'Rechazado':
        return 'status-error';
      case 'Pendiente':
        return 'status-warning';
      case 'No disponible':
        return 'status-disabled';
      default:
        return 'status-unknown';
    }
  };

  return (
    <Box
      round='small'
      hoverIndicator={{
        elevation: 'medium'
      }}
      onClick={() => {}}>
      <Card pad='medium'>
        <CardHeader pad='xsmall'>{`Práctica ${practica.applicationNumber}`}</CardHeader>
        <CardBody direction='row' justify='between'>
          <Box>
            <Card pad='small' background={practicaColorStatus(practica.status)}>
              <CardBody>{practica.status}</CardBody>
            </Card>
          </Box>
          <Box pad='small'>
            <FormNext />
          </Box>
        </CardBody>
        <CardFooter>
          <Button
            label='Lista  de prácticas'
            onClick={() =>
              history.push(`/internship/${practica.studentId}/${practica.id}`)
            }
          />
          <StudentIntention practica={practica} />
        </CardFooter>
      </Card>
    </Box>
  );
}

export default Practicas;
