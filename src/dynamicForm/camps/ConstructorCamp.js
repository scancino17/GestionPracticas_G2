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
  Typography
} from '@material-ui/core';
import { Add, Delete, Save } from '@material-ui/icons';
import { CustomTypes, FieldTypes } from './FormTypes';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};
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
  const [optionsSatisfaction, setOptionsSatisfaction] = useState([]);
  const [newOptionSatisfaction, setNewOptionSatisfaction] = useState('');
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (edit) {
      if (editElement.description) {
        setDescription(editElement.description);
      }
      setType(editElement.type);
      setName(editElement.name);
      setOptions(editElement.options);
      setOptionsSatisfaction(editElement.options);
    }
  }, [edit, editElement]);

  function handleSave() {
    let temp;
    if (type === FieldTypes.formTextInput) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === FieldTypes.formSelect) {
      temp = {
        type: type,
        name: name,
        options: newOption !== '' ? options.concat(newOption) : options,
        value: '',
        open: false
      };
      setNewOption('');
    } else if (type === FieldTypes.formFileInput) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === FieldTypes.formHeader) {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === FieldTypes.formSpace) {
      temp = {
        type: type
      };
    } else if (type === FieldTypes.formCustom) {
      temp = {
        type: type,
        type2: type2,
        value: '',
        name: type2
      };
    } else if (type === FieldTypes.formSatisfaction) {
      temp = {
        type: type,
        value: null,
        name: name,
        options:
          newOptionSatisfaction !== ''
            ? optionsSatisfaction.concat(newOptionSatisfaction)
            : optionsSatisfaction,
        description: description
      };
      setNewOptionSatisfaction('');
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
    setType('');
    setType2('');
    setName('');
    setOptions([]);
    setOptionsSatisfaction([]);
    setDescription('');
    setEdit(false);
    setShow(false);
  }
  function changeType(e) {
    setType(e.target.value);
    setName('');
    setOptions([]);
    setOptionsSatisfaction([]);
    setDescription('');
  }
  function handleNewOptionSelect() {
    if (!options.includes(newOption)) {
      setOptions((prev) => prev.concat(newOption));
      setNewOption('');
    }
  }
  function handleNewOptionSatisfaction() {
    if (!optionsSatisfaction.includes(newOptionSatisfaction)) {
      setOptionsSatisfaction((prev) => prev.concat(newOptionSatisfaction));
      setNewOptionSatisfaction('');
    }
  }
  return (
    <BootstrapDialog
      fullWidth
      onClose={() => handleExit()}
      aria-labelledby='customized-dialog-title'
      open={show}>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={() => handleExit()}>
        Creación de Campo
      </BootstrapDialogTitle>
      <DialogContent dividers>
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
            {Object.values(FieldTypes).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === FieldTypes.formTextInput ? (
          <TextField
            value={name}
            fullWidth
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === FieldTypes.formSelect ? (
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
                      error={options.includes(newOption)}
                      helperText={
                        options.includes(newOption)
                          ? 'La opción ya existe'
                          : null
                      }
                      fullWidth
                      variant='outlined'
                      value={newOption}
                      label='Nueva opción'
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={!newOption || options.includes(newOption)}
                      onClick={() => {
                        handleNewOptionSelect();
                      }}>
                      <Add />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : type === FieldTypes.formFileInput ? (
          <TextField
            fullWidth
            value={name}
            variant='outlined'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === FieldTypes.formHeader ? (
          <TextField
            fullWidth
            value={name}
            variant='outlined'
            label='Título'
            onChange={(e) => setName(e.target.value)}
          />
        ) : type === FieldTypes.formSpace ? (
          <></>
        ) : type === FieldTypes.formSatisfaction ? (
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
            <Typography style={{ marginTop: '1rem' }}>Opciones</Typography>
            <Table>
              <TableBody>
                {optionsSatisfaction &&
                  optionsSatisfaction.map((option) => (
                    <TableRow key={option.i}>
                      <TableCell>
                        <Typography>{option}</Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            setOptionsSatisfaction((prev) =>
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
                      error={optionsSatisfaction.includes(
                        newOptionSatisfaction
                      )}
                      helperText={
                        optionsSatisfaction.includes(newOptionSatisfaction)
                          ? 'La opción ya existe'
                          : null
                      }
                      fullWidth
                      variant='outlined'
                      value={newOptionSatisfaction}
                      label='Nueva opción'
                      onChange={(e) => setNewOptionSatisfaction(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={
                        !newOptionSatisfaction ||
                        optionsSatisfaction.includes(newOptionSatisfaction)
                      }
                      onClick={() => {
                        handleNewOptionSatisfaction();
                      }}>
                      <Add />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FormControl>
        ) : (
          type === FieldTypes.formCustom && (
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
                {Object.values(CustomTypes).map((option) => (
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
            (type === FieldTypes.formCustom && (!type2 || type2 === '')) ||
            (type === FieldTypes.formSelect &&
              options.length === 0 &&
              newOption === '') ||
            (type === FieldTypes.formSelect && options.includes(newOption)) ||
            (type === FieldTypes.formSatisfaction &&
              optionsSatisfaction.length === 0) ||
            ((type === FieldTypes.formFileInput ||
              type === FieldTypes.formHeader ||
              type === FieldTypes.formSelect ||
              type === FieldTypes.formTextInput ||
              type === FieldTypes.formSatisfaction) &&
              (name === null || name === '')) ||
            (type === FieldTypes.formSatisfaction &&
              optionsSatisfaction.length === 0 &&
              (description === null || description === '')) ||
            (type === FieldTypes.formSatisfaction &&
              optionsSatisfaction.includes(newOptionSatisfaction))
          }
          color='primary'
          startIcon={<Save />}
          onClick={() => {
            handleSave();
          }}>
          Guardar campo
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

export default ConstructorCamp;
