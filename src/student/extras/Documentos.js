import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

import React, { useEffect, useState } from 'react';

function Documentos({ docs }) {
  return (
    <Grid item xs={12}>
      <List>
        {docs.map((doc) => (
          <Documento doc={doc} />
        ))}
      </List>
    </Grid>
  );
}

function Documento({ doc }) {
  const [url, setUrl] = useState();

  useEffect(() => {
    doc.getDownloadURL().then((res) => setUrl(res));
  });

  return (
    <ListItem button component='a' href={url} target='_blank' rel='noopener'>
      <ListItemIcon>
        <GetApp />
      </ListItemIcon>
      <ListItemText primary={doc.name} />
    </ListItem>
  );
}

export default Documentos;
