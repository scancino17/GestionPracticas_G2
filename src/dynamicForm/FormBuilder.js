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
    <Grid border={1}>
      <Grid>
        <Box border={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope='col' border='bottom'>
                  <Typography>Nombre</Typography>
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  <Typography>Tipo</Typography>
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  <Typography>Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formInner.map((rec, i) => (
                <TableRow key={rec.i}>
                  <TableCell scope='col'>
                    <Grid>
                      <Typography>{rec.name}</Typography>
                    </Grid>
                  </TableCell>
                  <TableCell scope='col'>
                    <Typography>{rec.type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container direction='colum' spacing={4}>
                      <Grid xs={3}>
                        <IconButton onClick={() => hadlerDelete(rec, i)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                      <Grid xs={3}>
                        {i !== 0 && (
                          <IconButton onClick={() => handlerUp(i)}>
                            <ArrowUpward />
                          </IconButton>
                        )}
                        {i === 0 && (
                          <IconButton disabled onClick={() => handlerUp(i)}>
                            <ArrowUpward />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid xs={3}>
                        {i < formInner.length - 1 && (
                          <IconButton onClick={() => handlerDown(i)}>
                            <ArrowDownward />
                          </IconButton>
                        )}
                        {i === formInner.length - 1 && (
                          <IconButton disabled onClick={() => handlerDown(i)}>
                            <ArrowDownward />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Grid>

      <Grid>
        <Button fullWidth startIcon={<Add />} onClick={() => setShow(true)}>
          <Typography>Agregar Campo</Typography>
        </Button>
        {
          <ConstructorCamp
            handlerSetFormInnerInner={handlerSetFormInner}
            formInnerInner={formInner}
            indexInnerInner={indexInner}
            setShow={setShow}
            formFullInnerInner={formFullInner}
            setFlagInner={setFlag}
            show={show}
          />
        }
      </Grid>
    </Grid>
  );
}

export default FormBuilder;
