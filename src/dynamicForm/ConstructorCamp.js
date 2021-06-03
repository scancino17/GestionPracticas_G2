import React, { useState } from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Box,
  Modal,
  Typography
} from '@material-ui/core';
import { Add, Delete, Save } from '@material-ui/icons';

function ConstructorCamp({
  show,
  setShow,
  indexInnerInner,
  formFullInnerInner,
  handlerSetFormInnerInner,
  setFlagInner
}) {
  const [type, setType] = useState('');
  const [type2, setType2] = useState('');
  const [types, setTypes] = useState([
    'Input',
    'Select',
    'File',
    'Header',
    'Space',
    'Predefinido'
  ]);
  const [predefined, setPredefined] = useState(['Ciudad', 'Empresa']);
  const [name, setName] = useState('');
  const [openSelect, setopenSelect] = useState('');
  const [openSelect2, setopenSelect2] = useState('');
  const [options, setOpctions] = useState([]);
  const [newOption, setNewOption] = useState('');

  function handlerAddCamp() {
    let temp;
    if (type === 'Input') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Select') {
      temp = {
        type: type,
        name: name,
        options: options,
        value: '',
        open: false
      };
    } else if (type === 'File') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Header') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Space') {
      temp = {
        type: type
      };
    } else if (type === 'Predefinido') {
      temp = {
        type: type,
        type2: type2,
        value: '',
        name: type2
      };
    }
    const aux = formFullInnerInner;
    aux[indexInnerInner].form.push(temp);
    handlerSetFormInnerInner(aux);
    setFlagInner(true);
  }

  return (
    <Modal
      open={show}
      onClose={() => setShow(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box justifyContent='center' width={1 / 5}>
        <Box bgcolor='white' padding={8} borderRadius='2%'>
          <Grid container direction='column' spacing={5}>
            <Typography variant='h5'>Creación de Campo</Typography>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Tipo de Campo</InputLabel>
                <Select
                  fullWidth
                  value={type}
                  open={openSelect}
                  onClose={() => setopenSelect(false)}
                  onOpen={() => setopenSelect(true)}
                  onChange={(e) => setType(e.target.value)}>
                  <MenuItem value=''>None</MenuItem>
                  {types.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {type === 'Input' ? (
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  required
                  id='standard-required'
                  label={'Nombre'}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            ) : type === 'Select' ? (
              <Grid item>
                <h2>Select</h2>
                <Grid item>
                  <TextField
                    fullWidth
                    variant='outlined'
                    required
                    id='standard-required'
                    label={'Nombre'}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>

                <Grid item>
                  <Grid item width='auto' flex>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><h3>Opciones</h3></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {options.map((option) => (
                          <TableRow key={option.i}>
                            <TableCell>
                              <Typography>{option}</Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  setOpctions((prev) =>
                                    prev.filter((element) => element !== option)
                                  )
                                }>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <TextField
                              fullWidth
                              variant='outlined'
                              required
                              value={newOption}
                              id='standard-required'
                              label={'Nuevo opción'}
                              onChange={(e) => setNewOption(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setOpctions((prev) => prev.concat(newOption));
                                setNewOption('');
                              }}>
                              <Add />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Grid>
            ) : type === 'File' ? (
              <Grid item xs>
                <h2>File</h2>
                <TextField
                  fullWidth
                  variant='outlined'
                  required
                  id='standard-required'
                  label={'Nombre'}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            ) : type === 'Header' ? (
              <Grid item xs>
                <h2>Header</h2>
                <TextField
                  fullWidth
                  variant='outlined'
                  required
                  id='standard-required'
                  label={'Titulo'}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            ) : type === 'Space' ? (
              <></>
            ) : (
              type === 'Predefinido' && (
                <Grid item xs>
                  <FormControl fullWidth>
                    {/* select Predefinido*/}
                    <InputLabel>Tipo de Campo</InputLabel>
                    <Select
                      fullWidth
                      value={type2}
                      open={openSelect2}
                      onClose={() => setopenSelect2(false)}
                      onOpen={() => setopenSelect2(true)}
                      onChange={(e) => setType2(e.target.value)}>
                      <MenuItem value={''}>None</MenuItem>
                      {predefined.map((option) => (
                        <MenuItem value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )
            )}
            {type !== '' && (
              <Grid
                container
                direction='column'
                justify='center'
                alignItems='center'>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Save />}
                  onClick={() => {
                    handlerAddCamp();
                    setShow(false);
                  }}>
                  Guardar Campo
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

export default ConstructorCamp;
