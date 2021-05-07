import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Card, CardBody, CardHeader, List } from 'grommet';
import { FormNext } from 'grommet-icons';

function Practicas({ practicas }) {
  return (
    <List border={false} data={practicas}>
      {(practica) => <Practica practica={practica} />}
    </List>
  );
}

function PracticaCard({ practica }) {
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
    </Card>
  );
}

function Practica({ practica }) {
  let practicaDisponible = (practica) => {
    return practica.status !== 'No disponible';
  };

  let history = useHistory();

  return practicaDisponible(practica) ? (
    <Box
      round='small'
      hoverIndicator={{
        elevation: 'medium'
      }}
      onClick={() =>
        history.push(`/internship/${practica.studentId}/${practica.id}`)
      }>
      <PracticaCard practica={practica} />
    </Box>
  ) : (
    <PracticaCard practica={practica} />
  );
}

export default Practicas;
