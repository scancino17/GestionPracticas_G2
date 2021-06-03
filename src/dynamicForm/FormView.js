import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Selector from './Selector';
import { DropzoneArea } from 'material-ui-dropzone';
import { GetApp } from '@material-ui/icons';
import { storage } from '../firebase';

const UrlLink = ({ url, name }) => {
  return (
    <ListItem button component='a' href={url} target='_blank' rel='noopener'>
      <ListItemIcon>
        <GetApp />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
};
function InternshipIntentionFileList({
  student,
  internship,
  application,
  camp,
  name
}) {
  const [urls, setUrl] = useState();

  useEffect(() => {
    storage
      .ref(
        `/students-docs/${student}/${internship}/applications/${application}/${camp}/${name}`
      )
      .getDownloadURL()
      .then((url) => {
        setUrl(url);
      });
  }, [student, internship, application, camp, name]);

  return (
    <List>
      <UrlLink url={urls} name={name} />
    </List>
  );
}

function FormView({
  flag,
  setFlag,
  form,
  readOnly,
  studentId,
  internshipId,
  applicationId
}) {
  useEffect(() => {
    setFlag(false);
  }, [form, flag]);

  const updateItem = (index, whichvalue, newvalue) => {
    form[index][whichvalue] = newvalue;
    setFlag(true);
  };

  return (
    <Grid container direction='column' spacing={5}>
      {form
        ? form.map((element, index) =>
            element.type === 'Select' ? (
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel>{element.name}</InputLabel>
                  <Select
                    fullWidth
                    value={element.value}
                    open={element.open}
                    onClose={() => updateItem(index, 'open', false)}
                    onOpen={() => updateItem(index, 'open', true)}
                    onChange={(e) =>
                      !readOnly && updateItem(index, 'value', e.target.value)
                    }>
                    <MenuItem value=''>None</MenuItem>
                    {element.options.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : element.type === 'Input' ? (
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  required
                  id='standard-required'
                  label={element.name}
                  value={element.value}
                  onChange={(e) =>
                    !readOnly && updateItem(index, 'value', e.target.value)
                  }
                />
              </Grid>
            ) : element.type === 'File' ? (
              <Grid item>
                <>
                  <Typography variant='h6' gutterBottom>
                    {element.name}
                  </Typography>

                  {
                    //si el formulario es solo para ver se mostrarn los botones para descargar los archivos
                    !readOnly ? (
                      <DropzoneArea
                        initialFiles={element.value}
                        filesLimit={1}
                        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        onChange={(files) => updateItem(index, 'value', files)}
                      />
                    ) : (
                      <InternshipIntentionFileList
                        student={studentId}
                        internship={internshipId}
                        application={applicationId}
                        camp={element.name}
                        name={element.value}
                      />
                    )
                  }
                </>
              </Grid>
            ) : element.type === 'Header' ? (
              <Grid item>
                <Typography variant='h3' gutterBottom>
                  {element.name}
                </Typography>
              </Grid>
            ) : element.type === 'Space' ? (
              <Grid item>
                <Typography variant='h2' gutterBottom></Typography>
              </Grid>
            ) : element.type === 'predefinido' ? (
              element.type2 === 'Ciudad' ? (
                <Grid item>
                  <Typography variant='h4'>Ciudad</Typography>
                  <Selector
                    valueinner={element.value}
                    camp={element.type2}
                    onParentChange={(newValue) => {
                      updateItem(index, 'value', newValue.label);
                    }}
                  />
                </Grid>
              ) : element.type2 === 'Empresa' ? (
                <Grid item>
                  <Typography variant='h4'>Empresa</Typography>
                  <Selector
                    readOnly={readOnly}
                    valueinner={element.value}
                    camp={element.type2}
                    onParentChange={(newValue) => {
                      updateItem(index, 'value', newValue.label);
                    }}
                  />
                </Grid>
              ) : null
            ) : null
          )
        : null}
    </Grid>
  );
}

export default FormView;
