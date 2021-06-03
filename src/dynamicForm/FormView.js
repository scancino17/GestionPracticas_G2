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
const UrlLink = ({ file }) => {
  const [url, setUrl] = useState();

  const onDownload = () => {
    const link = document.createElement(file);
    link.download = `download.txt`;
    link.href = './download.txt';
    link.click();
  };

  return (
    <Button onClick={onDownload} variant='contained' color='primary'>
      Download
    </Button>
  );
};
function FormView({
  flag,
  setFlag,
  form,
  readOnly,
  filesInnerInner,
  setFilesInnerInner
}) {
  useEffect(() => {
    setFlag(false);
  }, [form, flag]);

  const updateItem = (index, whichvalue, newvalue) => {
    form[index][whichvalue] = newvalue;
    setFlag(true);
  };
  function setFiles(files) {
    //filesInnerInner.push(files[0]);
  }

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
                    initialFiles={element.value}
                    filesLimit={1}
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    onChange={(files) => setFiles(files)}
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
