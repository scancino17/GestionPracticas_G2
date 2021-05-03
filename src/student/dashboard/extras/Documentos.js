import { Anchor, Card, CardBody } from 'grommet';
import { Download } from 'grommet-icons';
import React, { useEffect, useState } from 'react';

function Documentos({ docs }) {
  return (
    <>
      {docs.map((doc) => {
        return <Documento doc={doc} />;
      })}
    </>
  );
}

function Documento({ doc }) {
  const [url, setUrl] = useState();

  useEffect(() => {
    doc.getDownloadURL().then((res) => setUrl(res));
  });

  return (
    <Card key={doc.name} margin='small' pad='medium'>
      <CardBody justify='between' direction='row'>
        <Anchor
          href={url}
          target='_blank'
          icon={<Download />}
          label={doc.name}
          reverse='true'
        />
      </CardBody>
    </Card>
  );
}

export default Documentos;
