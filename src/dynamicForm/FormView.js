import React, { useEffect, useState } from 'react';
import {
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
import { customTypes, formTypes } from './formTypes';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

function InternshipIntentionFileList({
  student,
  internship,
  application,
  camp,
  name
}) {
  const [url, setUrl] = useState();

  useEffect(() => {
    storage
      .ref(
        `/students-docs/${student}/${internship}/applications/${application}/${camp}/${name}`
      )
      .getDownloadURL()
      .then((url) => {
        setUrl(url);
      });
  }, []);

  return (
    <List>
      <ListItem button component='a' href={url} target='_blank' rel='noopener'>
        <ListItemIcon>
          <GetApp />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
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
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Grid container direction='column' spacing={4}>
        {form &&
          form.map((element, index) =>
            element.type === formTypes.formSelect ? (
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
            ) : element.type === formTypes.formTextInput ? (
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label={element.name}
                  value={element.value}
                  onChange={(e) =>
                    !readOnly &&
                    !element.readOnly &&
                    updateItem(index, 'value', e.target.value)
                  }
                />
              </Grid>
            ) : element.type === formTypes.formFileInput ? (
              <Grid item>
                <>
                  <Typography variant='h5'>{element.name}</Typography>
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
            ) : element.type === formTypes.formHeader ? (
              <Grid item>
                <Typography variant='h5'>{element.name}</Typography>
              </Grid>
            ) : element.type === formTypes.formSpace ? (
              <Grid item>
                <Typography variant='h5' />
              </Grid>
            ) : element.type === formTypes.formCustom ? (
              element.type2 === customTypes.formCiudad ? (
                <Grid item>
                  {readOnly ? (
                    <>
                      <TextField
                        fullWidth
                        variant='outlined'
                        label={element.name}
                        value={element.value}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant='h5'>Ciudad</Typography>
                      <Selector
                        readOnly={readOnly}
                        valueinner={element.value}
                        camp={element.type2}
                        onParentChange={(newValue) => {
                          updateItem(index, 'value', newValue.label);
                        }}
                      />
                    </>
                  )}
                </Grid>
              ) : element.type2 === customTypes.formEmpresa ? (
                <Grid item>
                  {readOnly ? (
                    <>
                      <TextField
                        fullWidth
                        variant='outlined'
                        label={element.name}
                        value={element.value}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant='h5'>Empresa</Typography>
                      <Selector
                        readOnly={readOnly}
                        valueinner={element.value}
                        camp={element.type2}
                        onParentChange={(newValue) => {
                          updateItem(index, 'value', newValue.label);
                        }}
                      />
                    </>
                  )}
                </Grid>
              ) : element.type2 === customTypes.formStartDate ? (
                <Grid item>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='DD/MM/YYYY'
                    label={customTypes.formStartDate}
                    value={element.value}
                    onChange={(date) =>
                      updateItem(index, 'value', date.toDate())
                    }
                  />
                </Grid>
              ) : element.type2 === customTypes.formEndDate ? (
                <Grid item>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='DD/MM/YYYY'
                    label={customTypes.formEndDate}
                    value={element.value}
                    onChange={(date) =>
                      updateItem(index, 'value', date.toDate())
                    }
                  />
                </Grid>
              ) : null
            ) : null
          )}
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

export default FormView;
