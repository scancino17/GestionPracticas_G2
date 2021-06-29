import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase';

const UrlLink = ({ file }) => {
  const [url, setUrl] = useState();

  useEffect(() => {
    file.getDownloadURL().then((res) => setUrl(res));
  });

  return (
    <ListItem button component='a' href={url} target='_blank' rel='noopener'>
      <ListItemIcon>
        <GetApp />
      </ListItemIcon>
      <ListItemText primary={file.name} />
    </ListItem>
  );
};
export function SeguroPracticaFileList({ studentId, internshipId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    storage
      .ref()
      .child(`students-docs/${studentId}/${internshipId}/seguro-practica/`)
      .listAll()
      .then((res) => setFiles(res.items));
  }, [internshipId, studentId]);

  return (
    <List>
      {files.map((file) => (
        <UrlLink file={file} />
      ))}
    </List>
  );
}
function InternshipIntentionFileList({ studentId, internshipId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    storage
      .ref()
      .child(`students-docs/${studentId}/${internshipId}/internship-intention/`)
      .listAll()
      .then((res) => setFiles(res.items));
  }, [internshipId, studentId]);

  return (
    <List>
      {files.map((file) => (
        <UrlLink file={file} />
      ))}
    </List>
  );
}

export default InternshipIntentionFileList;
