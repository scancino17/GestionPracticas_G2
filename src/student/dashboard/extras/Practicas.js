import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardFooter, CardHeader, Text } from 'grommet';
import { FormNext } from 'grommet-icons';

function Practicas({ practicas }) {
  return (
    <>
      {practicas.map((practica) => {
        return (
          <Practica
            applicationNumber={practica.applicationNumber}
            status={practica.status}
          />
        );
      })}
    </>
  );
}

function Practica({ applicationNumber, status }) {
  return (
    <Card key={`Práctica ${applicationNumber}`} margin='small' pad='medium'>
      <CardHeader>{`Práctica ${applicationNumber}`}</CardHeader>
      <CardFooter>
        <Text>{status}</Text>
        <Link to={`/formulario/${applicationNumber}`}>
          <Button icon={<FormNext />} />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default Practicas;
