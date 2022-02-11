import React, { useEffect, useState } from 'react';
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
import { DEFAULT_CAREER } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import { Skeleton } from '@material-ui/lab';

function EditBuilderPreview({
  open,
  value,
  setValue,
  setValueTab,
  valueTab,
  careerId,
  setCareerId,
  careerIdTab,
  setCareerIdTab,
  EditForm,
  EditSurvey,
  EditEvaluation
}) {
  const _ = require('lodash');
  const [formFull, setFormFull] = useState(null);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [indexEdit, setIndexEdit] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [newOption, setNewOption] = useState('');
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const {
    getCareerForm,
    setCareerForm,
    getSurveyForm,
    setSurveyForm,
    getEvaluateForm,
    setEvaluateForm
  } = useSupervisor();

  //peticion para actuializar variable careerIDTab
  useEffect(() => {
    console.log('formfull', formFull);
    if (careerId && careerId !== careerIdTab && careerId !== DEFAULT_CAREER) {
      if (careerIdTab === DEFAULT_CAREER) {
        setCareerIdTab(careerId);
      } else {
        changeCareer();
      }
    }
  }, [careerId]);

  //actualizar formulario al modificar la variable careerIdTab
  useEffect(() => {
    if (careerIdTab !== DEFAULT_CAREER) {
      getForm();
    }
  }, [careerIdTab]);

  useEffect(() => setFlag(false), [flag]);

  //peticion para actuializar variable de la pestaña
  useEffect(() => {
    if (value !== valueTab) {
      changeTab();
    }
  }, [value]);

  useEffect(() => getForm(), [valueTab]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getForm() {
    if (EditForm) {
      getCareerForm(careerId).then((careerForm) => setFormFull(careerForm));
    }
    if (EditSurvey) {
      getSurveyForm(careerId).then((careerForm) => setFormFull(careerForm));
    }
    if (EditEvaluation) {
      getEvaluateForm(careerId).then((careerForm) => setFormFull(careerForm));
    }
  }

  function setForm() {
    if (EditForm) {
      setCareerForm(careerIdTab, { form: formFull });
    }
    if (EditSurvey) {
      setSurveyForm(careerIdTab, { form: formFull });
    }
    if (EditEvaluation) {
      setEvaluateForm(careerIdTab, { form: formFull });
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function changeCareer() {
    if (EditForm) {
      getCareerForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave(true);
        } else {
          setCareerIdTab(careerId);
        }
      });
    }
    if (EditSurvey) {
      getSurveyForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave(true);
        } else {
          setCareerIdTab(careerId);
        }
      });
    }
    if (EditEvaluation) {
      getEvaluateForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave(true);
        } else {
          setCareerIdTab(careerId);
        }
      });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function changeTab() {
    if (EditForm) {
      getCareerForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave();
        } else {
          setValueTab(value);
          //setOpen(false)
        }
      });
    }
    if (EditSurvey) {
      getSurveyForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave();
        } else {
          setValueTab(value);
        }
      });
    }
    if (EditEvaluation) {
      getEvaluateForm(careerIdTab).then((careerForm) => {
        if (!_.isEqual(formFull, careerForm)) {
          handleSave();
        } else {
          setValueTab(value);
        }
      });
    }
  }

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
      cancelButtonText: 'Salir',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        //guaradar formulario en la base de datos
        setForm();

        if (changeCareer) {
          setCareerIdTab(careerId);
        } else {
          setValueTab(value);
          //setOpen(false)
        }

        Swal.fire('¡Formulario Guardado!', '', 'success');
      }
      if (result.isDenied) {
        if (changeCareer) {
          setCareerIdTab(careerId);
        } else {
          setValueTab(value);
          //setOpen(false)
        }
      }
      if (result.dismiss) {
        if (changeCareer) {
          setCareerId(careerIdTab);
        } else {
          setValue(valueTab);
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
      <Grid item style={{ margin: '2rem' }}>
        <Typography variant='h4'>
          {EditForm
            ? 'Formulario de inscripción de práctica'
            : EditSurvey
            ? 'Edición formulario de encuesta de satisfacción'
            : EditEvaluation
            ? 'Edición formulario de evaluación del estudiante'
            : null}
        </Typography>
      </Grid>
      <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
        {careerIdTab === careerId && formFull ? (
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
                {formFull && (
                  <>
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
