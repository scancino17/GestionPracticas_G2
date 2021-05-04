import { Anchor, Card, CardBody, List, Text } from 'grommet';
import { Download } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Documentos({ docs }) {
  return (
    <List border={false} data={docs}>
      {(doc) => <Documento doc={doc} />}
    </List>
  );
}

function Documento({ doc }) {
  const [url, setUrl] = useState();

  useEffect(() => {
    doc.getDownloadURL().then((res) => setUrl(res));
  });

  return (
    <Anchor href={url} target='_blank'>
      <Card pad='medium'>
        <CardBody direction='row' justify='between'>
          <Text>{doc.name}</Text>
          <Download />
        </CardBody>
      </Card>
    </Anchor>
  );
}

export default Documentos;
