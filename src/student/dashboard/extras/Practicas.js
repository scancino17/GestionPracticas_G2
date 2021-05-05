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

function Practica({ practica }) {
  return (
    <Link to={`/form/${practica.studentId}/${practica.id}`}>
      <Card pad='medium'>
        <CardBody direction='row' justify='between'>
          <Box>
            <Text>{`Práctica ${practica.applicationNumber}`}</Text>
            <Text>{practica.status}</Text>
          </Box>
          <Button icon={<FormNext />} />
        </CardBody>
      </Card>
    </Link>
  );
}

export default Practicas;
