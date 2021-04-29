import { Card, CardFooter, CardHeader, Text } from 'grommet';
import React from 'react';

function Practicas({ practicas }) {
  return (
    <>
      {practicas.map((practica) => {
        return (
          <Card margin='small' pad='medium'>
            <CardHeader>{practica.name}</CardHeader>
            <CardFooter>
              <Text>{practica.species}</Text>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}

export default Practicas;
