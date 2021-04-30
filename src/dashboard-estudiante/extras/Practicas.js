import { Card, CardFooter, CardHeader, Text } from 'grommet';
import React from 'react';

function Practicas({ practicas }) {
  return (
    <>
      {practicas.map((practica) => {
        return (
          <Card
            key={`Práctica ${practica.applicationNumber}`}
            margin='small'
            pad='medium'>
            <CardHeader>{`Práctica ${practica.applicationNumber}`}</CardHeader>
            <CardFooter>
              <Text>{practica.status}</Text>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}

export default Practicas;
