import { Anchor, Card, CardBody, List, Text, Box } from 'grommet';
import { Download } from 'grommet-icons';
import React, { useEffect, useState } from 'react';

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
    <Box
      round='small'
      hoverIndicator={{ elevation: 'medium' }}
      onClick={() => {}}>
      <Anchor href={url} target='_blank'>
        <Card pad='medium'>
          <CardBody direction='row' justify='between'>
            <Text>{doc.name}</Text>
            <Download />
          </CardBody>
        </Card>
      </Anchor>
    </Box>
  );
}

export default Documentos;
