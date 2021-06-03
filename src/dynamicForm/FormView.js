import React, { useEffect } from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Selector from './Selector';
import { DropzoneArea } from 'material-ui-dropzone';

function FormView({ flag, setFlag, form, readOnly }) {
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
                  <DropzoneArea
                    filesLimit={1}
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  />
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
            ) : element.type === 'Predefinido' ? (
              element.type2 === 'Ciudad' ? (
                <Grid item>
                  <h1>Ciudad</h1>
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
                  <h1>Empresa</h1>
                  <Selector
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
