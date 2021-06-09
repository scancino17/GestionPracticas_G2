import React, { useEffect, useState } from 'react';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Build,
  ArrowBack,
  ArrowForward,
  Save
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Divider,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import { formTypes } from './formTypes';
import { container } from '../admin/dashboard/extras/assets/jss/material-dashboard-react';

function EditForm() {
  const [formFull, setFormFull] = useState([
    {
      step: 'Información del estudiante',
      form: [
        {
          type: formTypes.formHeader,
          name: 'Información del estudiante',
          value: 'Información del estudiante'
        },
        {
          type: formTypes.formTextInput,
          name: 'Nombre del estudiante',
          value: '',
          readOnly: true
        },
        {
          type: formTypes.formTextInput,
          name: 'Rut del estudiante',
          value: '',
          readOnly: true
        },
        {
          type: formTypes.formTextInput,
          name: 'Número de matrícula',
          value: '',
          readOnly: true
        },
        {
          type: formTypes.formTextInput,
          name: 'Correo del estudiante',
          value: '',
          readOnly: true
        }
      ]
    }
  ]);
  const [show, setShow] = useState('');
  const [newOption, setNewOption] = useState('');
  const [flag, setFlag] = useState(false);
  const [careers, setCareers] = useState([]);
  const [careerId, setCareerId] = useState();
  const history = useHistory();

  useEffect(() => {
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== 'general') temp.push({ id: doc.id, ...doc.data() });
        });
        setCareers(temp);
      });
  }, []);

  useEffect(() => {
    if (careerId)
      db.collection('form')
        .doc(careerId)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data) {
            setFormFull(data.form);
          }
        });
  }, [careerId]);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  const [activeStep, setActiveStep] = useState(0);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleSave() {
    db.collection('form').doc(careerId).set({ form: formFull });
  }

  function handleDelete(element) {
    setFormFull((prev) => prev.filter((el) => el !== element));
  }

  function handleUp(index) {
    setFormFull((prev) => array_move(prev, index, index - 1));
    setFlag(true);
  }

  function handleDown(index) {
    setFormFull((prev) => array_move(prev, index, index + 1));
    setFlag(true);
  }

  function array_move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
  }

  return (
    <Grid container direction='row' >
      <Grid
        style={{
          backgroundImage: "url('AdminBanner-Edit.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat:'no-repeat',
          padding: '2rem'
        }}
        container>
        <Typography variant='h4'>
          Formularios de inscripción de práctica
        </Typography>
      </Grid>
      <Container maxWidth='xl'>
        
        <Grid container justify='flex-end' alignItems='center' spacing={4} style={{margin: '1rem'}}>
          <Grid item>
            <Typography variant='h5'>Carrera:</Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id='select-career'>Seleccionar carrera</InputLabel>
              <Select
                labelId='select-career'
                value={careerId}
                onChange={(e) => setCareerId(e.target.value)}
                style={{ minWidth: '12rem' }}>
                {careers.map((career) => {
                  return (
                    <MenuItem key={career.id} value={career.id}>
                      {career.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {careerId && (
          <Grid container direction='column' style={{ padding: '3rem 0 0 0' }}>
            <Grid container justify='center' spacing={8}>
              <Grid item direction='column' xs={12} md={5}>
                <Typography variant='h5'>Etapas</Typography>
                <Grid item container justify='center'>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<Build />}
                    onClick={() => setShow(true)}>
                    Administrar Etapas
                  </Button>
                </Grid>
              </Grid>
              <Divider orientation='vertical' flexItem />
              <Grid item xs={12} md={6}>
                <Typography variant='h5'>Previsualización</Typography>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  style={{ backgroundColor: 'transparent' }}>
                  {formFull.map((step) => (
                    <Step key={step.step}>
                      <StepLabel>{step.step}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant='h5' style={{ padding: '2rem 0 0 4rem' }}>
                Campos
              </Typography>
              {formFull.map(
                (form, i) =>
                  i === activeStep && (
                    <DynamicForm
                      form={form.form}
                      setForm={setFormFull}
                      formFull={formFull}
                      index={i}
                      admin
                    />
                  )
              )}
              <Grid
                container
                item
                justify='flex-end'
                alignItems='center'
                spacing={4}>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={activeStep === 0}
                    startIcon={<ArrowBack />}
                    onClick={handleBack}>
                    Anterior
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={
                      activeStep === formFull.length - 1
                        ? () => {
                            Swal.fire({
                              title: '¿Desea guardar los cambios?',
                              showDenyButton: true,
                              confirmButtonText: `Guardar`,
                              denyButtonText: `Salir`
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleSave();
                                Swal.fire(
                                  '¡Formulario Guardado!',
                                  '',
                                  'success'
                                ).then((result) => {
                                  if (result.isConfirmed) history.push('/');
                                });
                              }
                            });
                          }
                        : handleNext
                    }
                    endIcon={
                      activeStep === formFull.length - 1 ? (
                        <Save />
                      ) : (
                        <ArrowForward />
                      )
                    }>
                    {activeStep === formFull.length - 1
                      ? 'Terminar'
                      : 'Siguiente'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {/*Moddal */}
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Pasos del formulario</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formFull.map((form, i) => (
                  <TableRow key={form.i}>
                    <TableCell>{form.step}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={form.step === 'Información del estudiante'}
                        onClick={() => handleDelete(form)}>
                        <Delete />
                      </IconButton>
                      <IconButton disabled={i === 0} onClick={() => handleUp(i)}>
                        <ArrowUpward />
                      </IconButton>
                      <IconButton
                        disabled={i === formFull.length - 1}
                        onClick={() => handleDown(i)}>
                        <ArrowDownward />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={newOption}
                      label='Nuevo paso del formulario'
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={!newOption}
                      onClick={() => {
                        formFull.push({ step: newOption, form: [] });
                        setFlag(true);
                        setNewOption('');
                      }}>
                      <Add />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </Container>
    </Grid>
  );
}

export default EditForm;
