import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  const types = ['Input', 'Select', 'File', 'Header', 'Space', 'Predefinido'];
  const predefined = ['Ciudad', 'Empresa'];
  const [name, setName] = useState('');
  const [openSelect, setopenSelect] = useState('');
  const [openSelect2, setopenSelect2] = useState('');
  const [options, setOptions] = useState([]);
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
    <Dialog open={show} onClose={() => setShow(false)} fullWidth>
      <DialogTitle>Creación de Campo</DialogTitle>
      <DialogContent>
        <FormControl fullWidth style={{ marginBottom: '2rem' }}>
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
        {type === 'Input' ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === 'Select' ? (
          <>
            <TextField
              fullWidth
              variant='outlined'
              label='Nombre'
              onChange={(e) => setName(e.target.value)}
            />
            <Typography style={{ marginTop: '1rem' }}>Opciones</Typography>
            <Table>
              <TableBody>
                {options.map((option) => (
                  <TableRow key={option.i}>
                    <TableCell>
                      <Typography>{option}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          setOptions((prev) =>
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
                      value={newOption}
                      label='Nueva opción'
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={!newOption}
                      onClick={() => {
                        setOptions((prev) => prev.concat(newOption));
                        setNewOption('');
                      }}>
                      <Add />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : type === 'File' ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === 'Header' ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Título'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === 'Space' ? (
          <></>
        ) : (
          type === 'Predefinido' && (
            <FormControl fullWidth>
              {/* select predefinido*/}
              <InputLabel>Tipo de Campo</InputLabel>
              <Select
                fullWidth
                value={type2}
                open={openSelect2}
                onClose={() => setopenSelect2(false)}
                onOpen={() => setopenSelect2(true)}
                onChange={(e) => setType2(e.target.value)}>
                <MenuItem value=''>None</MenuItem>
                {predefined.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!type}
          color='primary'
          startIcon={<Save />}
          onClick={() => {
            handlerAddCamp();
            setShow(false);
          }}>
          Guardar campo
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConstructorCamp;
