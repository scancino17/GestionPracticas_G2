import React, { useEffect, useState } from 'react';
import DynamicForm from '../DynamicForm';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Build,
  ArrowBack,
  ArrowForward,
  Save,
  Edit
} from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Divider,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import CareerSelector from '../../../utils/CareerSelector';
import { DEFAULT_CAREER, useUser } from '../../../providers/User';
import { useSupervisor } from '../../../providers/Supervisor';
import { predefinedForm} from '../../predefined_forms/predefined';

function EditForm({open,setOpen,value,setValue,setValueTab,valueTab,careerId,setCareerId,careerIdTab,setCareerIdTab }) {
  const [formFull, setFormFull] = useState(predefinedForm);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [indexEdit, setIndexEdit] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [newOption, setNewOption] = useState('');
  const [flag, setFlag] = useState(false);

  const { getCareerForm, setCareerForm } = useSupervisor();

  useEffect(() => {
    getCareerForm(careerId).then((careerForm) =>
    {
      console.log('----------')
      console.log(careerForm)
      console.log(formFull)
      console.log('----------')
      if(formFull && careerForm!==formFull){
        if (careerId && careerId!==careerIdTab && careerId !== DEFAULT_CAREER) {
          if(careerIdTab=== DEFAULT_CAREER ){
            setCareerIdTab(careerId)
            getCareerForm(careerId).then((careerForm) =>
            setFormFull(careerForm),
            );
          }
          else{
            handleSave(true)
          }
        }
      }
    })
    
  }, [careerId, getCareerForm]);

  useEffect(() => setFlag(false), [flag]);
  useEffect(() => {
    if(value!==0 && open){
      handleSave()
    }
  }, [value, open, handleSave]);


  useEffect(() =>{
    if (careerId && careerId !== DEFAULT_CAREER) {
      getCareerForm(careerIdTab).then((careerForm) =>
        setFormFull(careerForm)
      );
  }}, [careerIdTab, getCareerForm]);

  const [activeStep, setActiveStep] = useState(0);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleEdit(index) {
    console.log(index);
    setEditValue(formFull[index].step);
    setIndexEdit(index);
    setEdit(true);
  }
  function handleSaveChanges() {
    const aux = formFull;
    aux[indexEdit].step = editValue;
    setFormFull(aux);
    setEdit(false);
  }

  function handleDelete(element) {
    setShow(false);
    Swal.fire({
      title: '¿Desea eliminar el paso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        setFormFull((prev) => prev.filter((el) => el !== element));
        setShow(true);
        setActiveStep(0);
      }
      if (result.isDismissed) {
        setShow(true);
      }
    });
  }

  function handleUp(index) {
    setFormFull((prev) => array_move(prev, index, index - 1));
    setFlag(true);
  }

  function handleDown(index) {
    setFormFull((prev) => array_move(prev, index, index + 1));
    setFlag(true);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleSave(changeCareer) {
    Swal.fire({
      title: '¿Desea guardar los cambios?',
      showDenyButton: true,
      confirmButtonText: `Guardar`,
      denyButtonText: `No guardar`,
      cancelButtonText:'Salir',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setCareerForm(careerIdTab, { form: formFull });
        if(changeCareer){
          setCareerIdTab(careerId)

          getCareerForm(careerIdTab).then((careerForm) =>
          setFormFull(careerForm),
          );
        }
        else{
          setValueTab(value)
          setOpen(false)
        }

        Swal.fire('¡Formulario Guardado!', '', 'success');
      }
      if (result.isDenied) {
        if(changeCareer){
          setCareerIdTab(careerId)

          getCareerForm(careerIdTab).then((careerForm) =>
          setFormFull(careerForm),
          );
        }
        else{
          setValueTab(value)
          setOpen(false)
        }
       
      }
      if(result.dismiss){
        if(changeCareer){
          setCareerId(careerIdTab)
        }
        else{
          setValue(valueTab)
        }
      } 
    });
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
    <Grid container direction='column'>
      <Grid item  style={{ margin: '2rem' }}>

        <Typography variant='h4'>
        Formulario de inscripción de práctica
        </Typography>

        </Grid>
      <Container maxWidth='xl' style={{ marginTop: '2rem' }}>

        {careerId && careerId !== DEFAULT_CAREER ? (
          <Grid container direction='column' style={{ padding: '3rem 0 0 0' }}>
            <Grid container direction='row' justifyContent='center' spacing={8}>
              <Grid item xs={12} md={5}>
                <Typography variant='h5'>Etapas</Typography>
                <Grid item container justifyContent='center'>
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
                justifyContent='flex-end'
                alignItems='center'
                spacing={4}>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<Save />}
                    onClick={handleSave}>
                    Guardar
                  </Button>
                </Grid>

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
                    disabled={activeStep === formFull.length - 1}
                    onClick={handleNext}
                    endIcon={<ArrowForward />}>
                    Siguiente
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justifyContent='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img src='EmptyState-3x.png' width='300' alt='Banner' />
            </Grid>
            <Grid item>
              <Typography variant='h5' color='textSecondary'>
                Selecciona una carrera para continuar
              </Typography>
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
                    {!edit || indexEdit !== i ? (
                      <TableCell>{form.step}</TableCell>
                    ) : (
                      <TableCell>
                        <TextField
                          fullWidth
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      </TableCell>
                    )}

                    <TableCell>
                      {!edit || indexEdit !== i ? (
                        <IconButton
                          disabled={edit}
                          onClick={() => handleEdit(i)}>
                          <Edit />
                        </IconButton>
                      ) : null}

                      {!(!edit || indexEdit !== i) ? (
                        <IconButton onClick={() => handleSaveChanges(i)}>
                          <Save />
                        </IconButton>
                      ) : null}
                      <IconButton
                        disabled={form.uneditable || edit}
                        onClick={() => handleDelete(form)}>
                        <Delete />
                      </IconButton>
                      <IconButton
                        disabled={i === 0 || edit}
                        onClick={() => handleUp(i)}>
                        <ArrowUpward />
                      </IconButton>
                      <IconButton
                        disabled={i === formFull.length - 1 || edit}
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
