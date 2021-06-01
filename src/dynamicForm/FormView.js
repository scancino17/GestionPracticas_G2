import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Selector from './Selector';

function FormView({ flag, setFlag, form }) {
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
                      updateItem(index, 'value', e.target.value)
                    }>
                    <MenuItem value={''}>None</MenuItem>
                    {element.options.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : element.type === 'Input' ? (
              <Grid item xs>
                <TextField
                  fullWidth
                  variant='outlined'
                  xs={12}
                  required
                  id='standard-required'
                  label={element.name}
                  value={element.value}
                  onChange={(e) => updateItem(index, 'value', e.target.value)}
                />
              </Grid>
            ) : element.type === 'File' ? (
              <Grid item xs>
                <div>
                  <Typography variant='h6' gutterBottom>
                    {element.name}
                  </Typography>
                  <input
                    style={{ display: 'none' }}
                    accept='image/*'
                    id='contained-button-file'
                    multiple
                    type='file'
                  />
                  <label htmlFor='contained-button-file'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'>
                      Upload
                    </Button>
                  </label>
                </div>
              </Grid>
            ) : element.type === 'Header' ? (
              <Grid item xs>
                <Typography variant='h3' gutterBottom>
                  {element.name}
                </Typography>
              </Grid>
            ) : element.type === 'Space' ? (
              <Grid item xs>
                <Typography variant='h2' gutterBottom>
                  {' '}
                </Typography>
              </Grid>
            ) : element.type === 'predefinido' ? (
              element.type2 === 'Ciudad' ? (
                <Grid item xs>
                  <h1>predef</h1>
                  <Selector
                    valueinner={element.value}
                    camp={element.type2}
                    onParentChange={(newValue) => {
                      updateItem(index, 'value', newValue.label);
                    }}
                  />
                </Grid>
              ) : element.type2 === 'Compania' ? (
                <Grid item xs>
                  <h1>Compañia</h1>
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
