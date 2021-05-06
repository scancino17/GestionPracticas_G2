import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardBody, List, Text } from 'grommet';
import { FormNext } from 'grommet-icons';

function Practicas({ practicas }) {
  return (
    <List border={false} data={practicas}>
      {(practica) => <Practica practica={practica} />}
    </List>
  );
}

function PracticaCard({ practica }) {
  return (
    <Card pad='medium'>
      <CardBody direction='row' justify='between'>
        <Box>
          <Text>{`Práctica ${practica.applicationNumber}`}</Text>
          <Text>{practica.status}</Text>
        </Box>
        <Button icon={<FormNext />} />
      </CardBody>
    </Card>
  );
}

function Practica({ practica }) {
  let practicaDisponible = (practica) => {
    return practica.status === 'Disponible' || practica.status === 'Rechazado';
  };

  return practicaDisponible(practica) ? (
    <Link
      style={{ color: 'inherit', textDecoration: 'inherit' }}
      to={`/form/${practica.studentId}/${practica.id}`}>
      <PracticaCard practica={practica} />
    </Link>
  ) : (
    <PracticaCard practica={practica} />
  );
}

export default Practicas;
