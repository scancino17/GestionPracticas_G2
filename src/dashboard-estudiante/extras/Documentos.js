import { Card, CardBody, Text } from 'grommet';
import { Download } from 'grommet-icons';
import React from 'react';

function Documentos({ docs }) {
  return (
    <>
      {docs.map((doc) => {
        return (
          <Card margin='small' pad='medium'>
            <CardBody justify='between' direction='row'>
              <Text>{doc.name}</Text>
              <Download />
            </CardBody>
          </Card>
        );
      })}
    </>
  );
}

export default Documentos;
