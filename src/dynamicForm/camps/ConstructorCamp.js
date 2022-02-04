import React, { useState, useEffect } from 'react';
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
  setFlagInner,
  edit,
  setEdit,
  editIndex,
  editElement
}) {
  const [type, setType] = useState('');
  const [type2, setType2] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openSelect, setopenSelect] = useState(false);
  const [openSelect2, setopenSelect2] = useState(false);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (edit) {
      if(editElement.description){
        setDescription(editElement.description);
      }
      setType(editElement.type);
      setName(editElement.name);
      setOptions(editElement.options);
    }
  }, [edit, editElement]);

  function handleSave() {
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
        value: '',
        name: type2
      };
    } else if (type === formTypes.formSatisfaction) {
      temp = {
        type: type,
        value: null,
        name: name,
        description: description
      };
    }

    const aux = formFullInnerInner;
    if (edit) {
      aux[indexInnerInner].form[editIndex] = temp;
      setEdit(false);
    } else {
      aux[indexInnerInner].form.push(temp);
    }
    handleExit();
    handlerSetFormInnerInner(aux);
    setFlagInner(true);
  }

  function handleExit() {
    setName('');
    setType('');
    setType2('');
    setOptions([]);
    setEdit(false);
    setShow(false);
  }
  function changeType(e) {
    setType(e.target.value);
    setOptions([]);
    setName('');
  }

  return (
    <Dialog open={show} onClose={() => handleExit()} fullWidth>
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
            onChange={(e) => changeType(e)}>
            <MenuItem value=''>None</MenuItem>
            {Object.values(formTypes).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === formTypes.formTextInput ? (
          <TextField
            value={name}
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formSelect ? (
          <>
            <TextField
              value={name}
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
            value={name}
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formHeader ? (
          <TextField
            fullWidth
            value={name}
            variant='outlined'
            label='Título'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === formTypes.formSpace ? (
          <></>
        ) : type === formTypes.formSatisfaction ? (
          <FormControl fullWidth>
            <TextField
              value={name}
              fullWidth
              variant='outlined'
              label='Nombre'
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              style={{ marginTop: '1rem' }}
              value={description}
              fullWidth
              multiline
              rows={4}
              variant='outlined'
              label='Descripción'
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={
            !type ||
            (type === formTypes.formCustom && (!type2 || type2 === '')) ||
            (type === formTypes.formSelect && options.length === 0) ||
            ((type === formTypes.formFileInput ||
              type === formTypes.formHeader ||
              type === formTypes.formSelect ||
              type === formTypes.formTextInput) &&
              (name === null || name === ''))
          }
          color='primary'
          startIcon={<Save />}
          onClick={() => {
            handleSave();
          }}>
          Guardar campo
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConstructorCamp;
