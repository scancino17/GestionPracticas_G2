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
import {
  Delete,
  ArrowUpward,
  ArrowDownward,
  Add,
  Edit
} from '@material-ui/icons';
import ConstructorCamp from '../camps/ConstructorCamp';
import Swal from 'sweetalert2';

function FormBuilder({
  formInner,
  flag,
  setFlag,
  indexInner,
  formFullInner,
  handlerSetFormInner
}) {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(10);
  const [editElement, setEditElement] = useState({
    type: '',
    name: '',
    options: '',
    description: '',
    value: ''
  });

  useEffect(() => {
    setFlag(false);
  }, [formInner, flag, setFlag]);

  function hadlerDelete(element, i) {
    Swal.fire({
      title: '¿Desea eliminar el elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        const aux = formFullInner;
        aux[indexInner].form.splice(i, 1);
        handlerSetFormInner(aux);
        setFlag(true);
      }
    });
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

  function handleEdit(rec, i) {
    setEditElement(rec);
    setEditIndex(i);
    setEdit(true);
    setShow(true);
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
      container
      direction='column'
      justifyContent='flex-start'
      alignItems='flex-end'>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'>
        <Box width={'100%'}>
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
                <TableRow key={i}>
                  <TableCell>
                    <Typography style={{ maxWidth: '10rem' }}>
                      {rec.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography style={{ maxWidth: '7rem' }}>
                      {rec.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container direction='row'>
                      <Grid>
                        <IconButton
                          disabled={rec.uneditable}
                          onClick={() => handleEdit(rec, i)}>
                          <Edit />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          disabled={rec.uneditable}
                          onClick={() => hadlerDelete(rec, i)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          disabled={i === 0}
                          onClick={() => handlerUp(i)}>
                          <ArrowUpward />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          disabled={i === formInner.length - 1}
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

      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'>
        <Button
          style={{ marginTop: '20px', marginBottom: '20px' }}
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
          edit={edit}
          setEdit={setEdit}
          editIndex={editIndex}
          editElement={editElement}
        />
      </Grid>
    </Grid>
  );
}

export default FormBuilder;
