import {
  Input,
  Select,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Container
} from '@material-ui/core';
import { useEffect, useState } from 'react';

function FormView(props) {
  const theme = useTheme();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  useEffect(() => {
    props.setFlag(false);
  }, [props.form, props.flag]);

  const updateItem = (index, whichvalue, newvalue) => {
    let g = props.form[index];
    g[whichvalue] = newvalue;
    props.handlerSetFormInner((prev) => [
      ...prev.slice(0, index),
      g,
      ...prev.slice(index + 1)
    ]);
  };

  return (
    <Card>
      <CardContent>
        <Grid container direction='column' spacing={5}>
          {props.form
            ? props.form.map((element, index) =>
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
                      defaultValue={element.value}
                      onChange={(e) =>
                        updateItem(index, 'value', e.target.value)
                      }
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
                ) : null
              )
            : null}
        </Grid>
      </CardContent>
    </Card>
  );
}
export default FormView;
