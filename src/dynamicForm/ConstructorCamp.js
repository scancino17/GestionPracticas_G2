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
import { customTypes, formTypes } from './formTypes';

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
  const [name, setName] = useState('');
  const [openSelect, setopenSelect] = useState('');
  const [openSelect2, setopenSelect2] = useState('');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  function handlerAddCamp() {
    let temp;
    if (type === formTypes.formTextInput) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === formTypes.formSelect) {
      temp = {
        type: type,
        name: name,
        options: options,
        value: '',
        open: false
      };
    } else if (type === formTypes.formFileInput) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === formTypes.formHeader) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === formTypes.formSpace) {
      temp = {
        type: type
      };
    } else if (type === formTypes.formCustom) {
      temp = {
        type: type,
        type2: type2,
        value:
          type2 === customTypes.formStartDate ||
          type2 === customTypes.formEndDate
            ? new Date()
            : '',
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
            {Object.values(formTypes).map((option) => (
              <MenuItem value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === formTypes.formTextInput ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formSelect ? (
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
        ) : type === formTypes.formFileInput ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formHeader ? (
          <TextField
            fullWidth
            variant='outlined'
            label='Título'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formSpace ? (
          <></>
        ) : (
          type === formTypes.formCustom && (
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
                {Object.values(customTypes).map((option) => (
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
