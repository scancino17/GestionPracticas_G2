import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  IconButton
} from '@material-ui/core';
import { Delete, ArrowUpward, ArrowDownward, Add } from '@material-ui/icons';
import ConstructorCamp from './ConstructorCamp';

function FormBuilder({
  formInner,
  flag,
  setFlag,
  indexInner,
  formFullInner,
  handlerSetFormInner
}) {
  const [show, setShow] = useState(false);
  const defaultInputs = [
    'Información del estudiante',
    'Nombre del estudiante',
    'Rut del estudiante',
    'Número de matrícula',
    'Correo del estudiante'
  ];

  useEffect(() => {
    setFlag(false);
  }, [formInner, flag]);

  function hadlerDelete(element, i) {
    const aux = formFullInner;
    aux[indexInner].form.splice(i, 1);
    handlerSetFormInner(aux);
    setFlag(true);
  }

  function handlerUp(index) {
    const aux = formFullInner;
    aux[indexInner].form = array_move(aux[indexInner].form, index, index - 1);
    handlerSetFormInner(aux);
    setFlag(true);
  }

  function handlerDown(index) {
    const aux = formFullInner;
    aux[indexInner].form = array_move(aux[indexInner].form, index, index + 1);
    handlerSetFormInner(aux);
    setFlag(true);
  }

  function array_move(arr, old_index, new_index) {
    while (old_index < 0) old_index += arr.length;
    while (new_index < 0) new_index += arr.length;
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) arr.push(undefined);
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
  }

  return (
    <Grid
      border={1}
      container
      direction='column'
      justifyContent='flex-start'
      alignItems='flex-end'>
      <Grid container direction='column' justifyContent='center' alignItems='center'>
        <Box pl={6} pb={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Nombre</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Tipo</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formInner.map((rec, i) => (
                <TableRow key={rec.i}>
                  <TableCell>
                    <Typography noWrap style={{ width: '10rem' }}>
                      {rec.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap style={{ width: '10rem' }}>
                      {rec.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container>
                      <Grid>
                        <IconButton
                          disabled={defaultInputs.includes(rec.name)}
                          onClick={() => hadlerDelete(rec, i)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          disabled={defaultInputs.includes(rec.name) || i === 0}
                          onClick={() => handlerUp(i)}>
                          <ArrowUpward />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          disabled={
                            (defaultInputs.includes(rec.name) &&
                              i <= defaultInputs.length) ||
                            i === formInner.length - 1
                          }
                          onClick={() => handlerDown(i)}>
                          <ArrowDownward />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Grid>

      <Grid container direction='column' justifyContent='center' alignItems='center'>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Add />}
          onClick={() => setShow(true)}>
          Agregar Campo
        </Button>
        <ConstructorCamp
          handlerSetFormInnerInner={handlerSetFormInner}
          formInnerInner={formInner}
          indexInnerInner={indexInner}
          setShow={setShow}
          formFullInnerInner={formFullInner}
          setFlagInner={setFlag}
          show={show}
        />
      </Grid>
    </Grid>
  );
}

export default FormBuilder;
