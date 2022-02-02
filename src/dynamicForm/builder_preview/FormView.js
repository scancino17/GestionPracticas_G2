import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Divider,
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
import Selector from '../camps/Selector';
import { DropzoneArea } from 'material-ui-dropzone';
import { GetApp } from '@material-ui/icons';
import { storage } from '../../firebase';
import { customTypes, formTypes } from '../camps/formTypes';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useUser } from '../../providers/User';

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
  }, [application, camp, internship, name, student]);

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
  applicationId,
  admin
}) {
  const { user } = useUser();

  useEffect(() => {
    setFlag(false);
  }, [form, flag, setFlag]);

  const updateItem = (index, whichvalue, newvalue) => {
    form[index][whichvalue] = newvalue;
    setFlag(true);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction='column' spacing={4}>
        {form &&
          form.map((element, index) =>
            element.type === formTypes.formSelect ? (
              <Grid item key={index}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel id={element.name}>{element.name}</InputLabel>
                  <Select
                    labelId={element.name}
                    label={element.name}
                    fullWidth
                    variant='outlined'
                    value={element.value}
                    open={element.open}
                    onClose={() => updateItem(index, 'open', false)}
                    onOpen={() => updateItem(index, 'open', true)}
                    onChange={(e) =>
                      !readOnly && updateItem(index, 'value', e.target.value)
                    }>
                    <MenuItem value=''>None</MenuItem>
                    {element.options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : element.type === formTypes.formTextInput ? (
              <Grid item key={index}>
                <TextField
                  fullWidth
                  variant='outlined'
                  label={element.name}
                  value={element.value}
                  onChange={(e) =>
                    !readOnly &&
                    (!element.readOnly || user.admin) &&
                    updateItem(index, 'value', e.target.value)
                  }
                />
              </Grid>
            ) : element.type === formTypes.formFileInput ? (
              <Grid item key={index}>
                <>
                  <Typography variant='h5'>{element.name}</Typography>
                  {
                    //si el formulario es solo para ver se mostrarn los botones para descargar los archivos
                    !readOnly ? (
                      !admin ? (
                        <>
                          <DropzoneArea
                            initialFiles={element.value}
                            showFileNames
                            filesLimit={1}
                            acceptedFiles={['application/pdf']}
                            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            onChange={(files) =>
                              updateItem(index, 'value', files)
                            }
                          />
                          {element.value !== '' &&
                            typeof element.value === 'string' && (
                              <Typography color='textSecondary'>
                                {`Si no se sube un nuevo archivo se utilizará el
                                anterior (${element.value})`}
                              </Typography>
                            )}
                        </>
                      ) : (
                        <Typography>
                          Los archivos no pueden ser modificados
                        </Typography>
                      )
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
              <Grid item key={index}>
                <Typography variant='h5'>{element.name}</Typography>
              </Grid>
            ) : element.type === formTypes.formSpace ? (
              <Grid item key={index}>
                <Typography variant='h5' />
              </Grid>
            ) : element.type === formTypes.formSatisfaction ? (
              <Grid item key={index}>
                <Divider />
                <FormControl component='checkSatisfaction'>
                  <Typography variant='h5'>{element.name}</Typography>
                  <Typography
                    variant='h10'
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    {element.description + '\n'}
                  </Typography>
                  <Grid container justifyContent='flex-start'>
                    <Grid item>
                      <FormGroup aria-label='position'>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={element.value === 0}
                              onChange={() => updateItem(index, 'value', 0)}
                              style={{
                                color: '#36568C'
                              }}
                            />
                          }
                          label=' Destacado '
                          labelPlacement='end'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={element.value === 1}
                              onChange={() => updateItem(index, 'value', 1)}
                              style={{
                                color: '#36568C'
                              }}
                            />
                          }
                          label='   Bueno   '
                          labelPlacement='end'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={element.value === 2}
                              onChange={() => updateItem(index, 'value', 2)}
                              style={{
                                color: '#36568C'
                              }}
                            />
                          }
                          label=' Suficiente '
                          labelPlacement='end'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={element.value === 3}
                              onChange={() => updateItem(index, 'value', 3)}
                              style={{
                                color: '#36568C'
                              }}
                            />
                          }
                          label='Insuficiente'
                          labelPlacement='end'
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </FormControl>
                <Divider />
              </Grid>
            ) : element.type === formTypes.formCustom ? (
              element.type2 === customTypes.formCiudad ? (
                <Grid item key={index}>
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
                    <Selector
                      readOnly={readOnly}
                      valueinner={element.value}
                      camp={element.type2}
                      selectorLabel='Ciudad'
                      onParentChange={(newValue) => {
                        updateItem(
                          index,
                          'value',
                          newValue.inputValue
                            ? newValue.inputValue
                            : newValue.label
                        );
                      }}
                    />
                  )}
                </Grid>
              ) : element.type2 === customTypes.formEmpresa ? (
                <Grid item key={index}>
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
                    <Selector
                      readOnly={readOnly}
                      valueinner={element.value}
                      camp={element.type2}
                      selectorLabel='Empresa'
                      onParentChange={(newValue) => {
                        updateItem(
                          index,
                          'value',
                          newValue.inputValue
                            ? newValue.inputValue
                            : newValue.label
                        );
                      }}
                    />
                  )}
                </Grid>
              ) : element.type2 === customTypes.formStartDate ? (
                <Grid item key={index}>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    label={customTypes.formStartDate}
                    value={
                      element.value === ''
                        ? new Date()
                        : element.value instanceof Date
                        ? element.value
                        : element.value.toDate()
                    }
                    onChange={(date) => updateItem(index, 'value', date)}
                  />
                </Grid>
              ) : element.type2 === customTypes.formEndDate ? (
                <Grid item key={index}>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    label={customTypes.formEndDate}
                    value={
                      element.value === ''
                        ? new Date()
                        : element.value instanceof Date
                        ? element.value
                        : element.value.toDate()
                    }
                    onChange={(date) => updateItem(index, 'value', date)}
                  />
                </Grid>
              ) : element.type2 === customTypes.formCountry ? (
                <Grid item key={index}>
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
                    <Selector
                      readOnly={readOnly}
                      valueinner={element.value}
                      camp={element.type2}
                      selectorLabel='País'
                      onParentChange={(newValue) => {
                        updateItem(
                          index,
                          'value',
                          newValue.inputValue
                            ? newValue.inputValue
                            : newValue.label
                        );
                      }}
                    />
                  )}
                </Grid>
              ) : null
            ) : null
          )}
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

export default FormView;
