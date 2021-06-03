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
        <Grid container direction='column' style={{padding: '3rem 0 0 0'}}>
          <Grid container justify='center' spacing={8} >
            <>
              <Grid
                  item 
                  direction='column'
                  justify='center'
                  alignItems='center'
                  xs={12} 
                  md={5}>
                <Typography variant='h5'>
                  Etapas
                </Typography>
                <Grid 
                  container
                  direction='column'
                  justify='center'
                  alignItems='center'
                  style={{padding: '3rem 0 0 0'}}>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<Build />}
                    onClick={() => setShow(true)}>
                    Administrar Etapas
                  </Button>
                </Grid>
              </Grid>
            

            <Divider orientation="vertical" flexItem/>

            <Grid item xs={12} md={6}>
              <Typography variant='h5'>
                Previsualización
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel style={{backgroundColor: 'transparent'}}>
                {formFull.map((step) => (
                  <Step key={step.step}>
                    <StepLabel>{step.step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            </>
          </Grid>
          <>
            {activeStep === formFull.length ? (
              <>
                <Typography>Guardar</Typography>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSave}
                  startIcon={<Save />}>
                  Guardar
                </Button>
              </>
            ) : (
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
                  justify='center' 
                  spacing={8}>
                  <Grid 
                    item 
                    xs={12} 
                    md={5}>

                  </Grid>
                  <Divider 
                   orientation='vertical' 
                   flexItem/>
                  <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    style={{padding: '3rem 0 0 2rem'}}>
                    <Grid 
                      container 
                      direction='row'
                      justify='flex-start'
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
                          onClick={activeStep === formFull.length - 1 ? (
                              handleSave
                            ) : (
                              handleNext
                            )}
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
                          <IconButton onClick={() => handleDelete(form)}>
                            <Delete />
                          </IconButton>
                          <IconButton
                            disabled={i === 0}
                            onClick={() => handleUp(i)}>
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
          </>
        </Grid>
      )}
    </Container>
  );
}

export default EditForm;
