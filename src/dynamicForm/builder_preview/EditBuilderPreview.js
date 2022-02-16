import React, { useEffect, useState, useCallback } from 'react';
import DynamicForm from '../builder_preview/DynamicForm';
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
import { useSupervisor } from '../../providers/Supervisor';
import { Skeleton } from '@material-ui/lab';
import { FormTypes } from '../camps/FormTypes';
import { DEFAULT_CAREER } from '../../providers/User';

function EditBuilderPreview({
  selectedTab,
  setCurrentTab,
  currentTab,
  selectedCareer,
  currentCareer,
  setCurrentCareer,
  formType
}) {
  const _ = require('lodash');
  const [editableForm, setEditableForm] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [indexEdit, setIndexEdit] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [newOption, setNewOption] = useState('');
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { getForm, setForm } = useSupervisor();

  // Cargar datos cuando cambie el tipo de formulario o la carrera seleccionada
  // También hace la carga inicial
  useEffect(
    () =>
      getForm(formType, currentCareer).then((careerForm) => {
        // Ojo: structuredClone crea una copia profunda de careerForm.
        // El método es global, implementado por los navegadores y nodejs.
        // En febrero de 2022, su implementación es *muy* reciente,
        // y todavía no es del todo soportado por navegadores comunes
        // por lo que podría dar problemas. A futuro, esta función debería
        // ser implementada tal cual se usa aquí.
        setEditableForm(structuredClone(careerForm));
        setCurrentForm(careerForm);
      }),
    [currentCareer, formType, getForm]
  );

  useEffect(() => setFlag(false), [flag]);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleEdit(index) {
    console.log(index);
    setEditValue(editableForm[index].step);
    setIndexEdit(index);
    setEdit(true);
  }

  function handleSaveChanges() {
    const aux = editableForm;
    aux[indexEdit].step = editValue;
    setEditableForm(aux);
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
        setEditableForm((prev) => prev.filter((el) => el !== element));
        setShow(true);
        setActiveStep(0);
      }
      if (result.isDismissed) {
        setShow(true);
      }
    });
  }

  function handleUp(index) {
    setEditableForm((prev) => array_move(prev, index, index - 1));
    setFlag(true);
  }

  function handleDown(index) {
    setEditableForm((prev) => array_move(prev, index, index + 1));
    setFlag(true);
  }

  // Manejar guardado de cambios
  const handleSave = useCallback(() => {
    Swal.fire({
      title: '¿Desea guardar los cambios?',
      showDenyButton: true,
      confirmButtonText: `Guardar`,
      denyButtonText: `No guardar`,
      cancelButtonText: 'Salir',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Guardar formulario en la base de datos
        setForm(formType, currentCareer, { form: editableForm });
        Swal.fire('¡Formulario Guardado!', '', 'success');
      }
      if (currentTab !== selectedTab) setCurrentTab(selectedTab);
      if (currentCareer !== selectedCareer) setCurrentCareer(selectedCareer);
    });
  }, [
    currentCareer,
    currentTab,
    editableForm,
    formType,
    selectedCareer,
    selectedTab,
    setCurrentCareer,
    setCurrentTab,
    setForm
  ]);

  // Manejar cambios de pestaña o carrera
  const handleChanges = useCallback(() => {
    // Decartar si la carrera inicial es el default
    // Este caso es manejado por el componente padre (SelectEdit.js)
    // Si hubiera que decoplar los componentes, bastaría con ponerlo como
    // condición en el if que le sigue al siguiente.
    if (currentCareer === DEFAULT_CAREER) return;

    // Descartar si no se ha cambiado de pestaña
    if (currentTab === selectedTab && selectedCareer === currentCareer) return;

    // Manejar casos en que no ha habido cambios
    // Si los forms son null, se cuenta como que no ha habido cambios,
    // Se permite que cambie de pestaña
    if (
      !(currentForm && editableForm) ||
      _.isEqual(currentForm, editableForm)
    ) {
      // Caso: cambiar tab
      if (currentTab !== selectedTab) setCurrentTab(selectedTab);
      // Caso: cambiar carrera
      if (currentCareer !== selectedCareer) setCurrentCareer(selectedCareer);
      // Terminar ejecución
      return;
    }

    // De aquí en adelante, ha habido cambios en el formulario
    handleSave();
  }, [
    selectedTab,
    selectedCareer,
    currentTab,
    currentCareer,
    _,
    currentForm,
    editableForm,
    setCurrentTab,
    setCurrentCareer,
    handleSave
  ]);

  // Correr callback para controlar cambio de pestaña / carrera
  // Y mostrar modal de guardar cambios al haber cambios no guardados.
  useEffect(() => handleChanges(), [handleChanges]);

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
      <Grid item style={{ margin: '2rem' }}>
        <Typography variant='h4'>
          {
            {
              [FormTypes.ApplicationForm]:
                'Formulario de inscripción de práctica',
              [FormTypes.EvaluationForm]:
                'Edición formulario de evaluación del estudiante',
              [FormTypes.SurveyForm]:
                'Edición formulario de encuesta de satisfacción'
            }[formType]
          }
        </Typography>
      </Grid>
      <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
        {currentCareer === selectedCareer && editableForm ? (
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
                  {editableForm.map((step) => (
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
              {editableForm.map(
                (form, i) =>
                  i === activeStep && (
                    <DynamicForm
                      form={form.form}
                      setForm={setEditableForm}
                      formFull={editableForm}
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
                    disabled={activeStep === editableForm.length - 1}
                    onClick={handleNext}
                    endIcon={<ArrowForward />}>
                    Siguiente
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container direction='row' justifyContent='center' spacing={8}>
            <Grid item xs={12} md={5}>
              <Skeleton variant='text' height={800} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Skeleton variant='text' height={800} />
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
                {editableForm && (
                  <>
                    {editableForm.map((form, i) => (
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
                            disabled={i === editableForm.length - 1 || edit}
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
                            editableForm.push({ step: newOption, form: [] });
                            setFlag(true);
                            setNewOption('');
                          }}>
                          <Add />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </Container>
    </Grid>
  );
}

export default EditBuilderPreview;
