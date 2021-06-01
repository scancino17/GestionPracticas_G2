import React, { useEffect, useState } from 'react';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import { Add, ArrowDownward, ArrowUpward, Delete } from '@material-ui/icons';
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

  function hadlerDelete(element) {
    setFormFull((prev) => prev.filter((el) => el !== element));
  }

  function handlerUp(index) {
    setFormFull((prev) => array_move(prev, index, index - 1));
    setFlag(true);
  }

  function handlerDown(index) {
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
      <Typography variant='h4' style={{ marginTop: '3rem' }}>
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
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleNext}>
                    {activeStep === formFull.length - 1 ? 'Finish' : 'Next'}
                  </Button>
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
                          <TableCell scope='col' border='bottom'>
                            <Typography>Nombre</Typography>
                          </TableCell>
                          <TableCell scope='col' border='bottom'>
                            <Typography>Acciones</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formFull.map((form, i) => (
                          <TableRow key={form.i}>
                            <TableCell scope='col'>
                              <Grid>
                                <Typography>{form.step}</Typography>
                              </Grid>
                            </TableCell>
                            <TableCell>
                              <Grid container direction='colum' spacing={4}>
                                <Grid xs={3}>
                                  <IconButton
                                    onClick={() => hadlerDelete(form)}>
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
                                    <IconButton
                                      disabled
                                      onClick={() => handlerUp(i)}>
                                      <ArrowUpward />
                                    </IconButton>
                                  )}
                                </Grid>
                                <Grid xs={3}>
                                  {i < formFull.length - 1 && (
                                    <IconButton onClick={() => handlerDown(i)}>
                                      <ArrowDownward />
                                    </IconButton>
                                  )}
                                  {i === formFull.length - 1 && (
                                    <IconButton
                                      disabled
                                      onClick={() => handlerDown(i)}>
                                      <ArrowDownward />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell scope='col'>
                            <TextField
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                            />
                          </TableCell>
                          <TableCell scope='col'>
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
