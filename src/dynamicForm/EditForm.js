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
  CheckCircleOutline
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
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

function EditForm() {
  const [formFull, setFormFull] = useState([]);
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
  });

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
    <Container>
      <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
        Formularios de inscripción de práctica
      </Typography>
      <Grid container justify='flex-end' alignItems='center' spacing={4}>
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
        <Grid container direction='column'>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Build />}
              onClick={() => setShow(true)}>
              Administrar Pasos
            </Button>
          </Grid>
          <Grid item>
            <Stepper activeStep={activeStep} alternativeLabel>
              {formFull.map((step) => (
                <Step key={step.step}>
                  <StepLabel>{step.step}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <>
            {activeStep === formFull.length ? (
              <>
                <Typography>Guardar</Typography>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSave}>
                  Guardar
                </Button>
              </>
            ) : (
              <Grid item>
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
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={activeStep === 0}
                    onClick={handleBack}>
                    Anterior
                  </Button>
                  {activeStep !== formFull.length - 1 && (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleNext}>
                      Siguiente
                    </Button>
                  )}
                  {activeStep === formFull.length - 1 && (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        Swal.fire({
                          title: '¿Desea Guardar los cambios?',
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
                          } else if (result.isDenied) {
                            Swal.fire(
                              'Revisa bien tu formulario antes de enviarlo',
                              '',
                              'info'
                            );
                          }
                        });
                      }}>
                      Guardar
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}
            {/*Moddal */}
            <Modal
              open={show}
              onClose={() => setShow(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Box bgcolor='white' padding={8}>
                <Grid container direction='column' spacing={5}>
                  <Grid item xs>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography>Nombre</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>Acciones</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formFull.map((form, i) => (
                          <TableRow key={form.i}>
                            <TableCell>
                              <Grid>
                                <Typography>{form.step}</Typography>
                              </Grid>
                            </TableCell>
                            <TableCell>
                              <Grid container direction='colum' spacing={4}>
                                <Grid xs={3}>
                                  <IconButton
                                    onClick={() => handleDelete(form)}>
                                    <Delete />
                                  </IconButton>
                                </Grid>
                                <Grid xs={3}>
                                  {i !== 0 && (
                                    <IconButton onClick={() => handleUp(i)}>
                                      <ArrowUpward />
                                    </IconButton>
                                  )}
                                  {i === 0 && (
                                    <IconButton
                                      disabled
                                      onClick={() => handleUp(i)}>
                                      <ArrowUpward />
                                    </IconButton>
                                  )}
                                </Grid>
                                <Grid xs={3}>
                                  {i < formFull.length - 1 && (
                                    <IconButton onClick={() => handleDown(i)}>
                                      <ArrowDownward />
                                    </IconButton>
                                  )}
                                  {i === formFull.length - 1 && (
                                    <IconButton
                                      disabled
                                      onClick={() => handleDown(i)}>
                                      <ArrowDownward />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <TextField
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
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
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </>
        </Grid>
      )}
    </Container>
  );
}

export default EditForm;
