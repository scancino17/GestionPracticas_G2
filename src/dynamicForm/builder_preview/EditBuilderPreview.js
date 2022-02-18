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
  Grid,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box
} from '@material-ui/core';
import { useSupervisor } from '../../providers/Supervisor';
import { Skeleton } from '@material-ui/lab';
import { FormTypes } from '../camps/FormTypes';
import { DEFAULT_CAREER } from '../../providers/User';
import useMediaQuery from '@mui/material/useMediaQuery';
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

function EditBuilderPreview({
  selectedTab,
  setSelectedTab,
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
      cancelButtonText: 'Cerrar',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Guardar formulario en la base de datos
        setForm(formType, currentCareer, { form: editableForm });
        Swal.fire('¡Formulario Guardado!', '', 'success');
      }
      if (result.isDismissed) {
        setSelectedTab(currentTab);
        // selectedTab no cambia instantáneamente, si no se retorna aqui
        // se forzará un rerender, descartando los cambios
        return;
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
    setForm,
    setSelectedTab
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
  function isMovileDevice() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
  const matches = useMediaQuery('(max-width:650px)');

  return (
    <Grid container direction='column'>
      <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
        {currentCareer === selectedCareer && editableForm ? (
          <Grid container direction='column' style={{ padding: '3rem 0 0 0' }}>
            <Grid item>
              <Grid
                container
                direction='row'
                justifyContent='center'
                spacing={isMovileDevice() && matches ? 0 : 6}>
                <Grid item xs={12} sm md xl>
                  <Box
                    sx={{
                      minWidth: isMovileDevice() && matches ? 300 : 318
                    }}>
                    <Typography variant='h5'>Etapas</Typography>
                    <Grid item container justifyContent='center'>
                      <Button
                        style={{ marginTop: '20px', marginBottom: '20px' }}
                        variant='contained'
                        color='primary'
                        startIcon={<Build />}
                        onClick={() => setShow(true)}>
                        Administrar Etapas
                      </Button>
                    </Grid>
                  </Box>
                </Grid>
                <Divider orientation='vertical' flexItem />

                <Grid item xs={12} sm md xl>
                  <Box
                    sx={{
                      minWidth: isMovileDevice() && matches ? 300 : 410
                    }}>
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
                  </Box>
                </Grid>
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
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-end'
                  alignItems='center'
                  spacing={1}
                  style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <Grid item xs={4} sm={2}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      disabled={activeStep === 0}
                      startIcon={<ArrowBack />}
                      onClick={handleBack}>
                      Anterior
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      disabled={activeStep === editableForm.length - 1}
                      onClick={handleNext}
                      endIcon={<ArrowForward />}>
                      Siguiente
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      startIcon={<Save />}
                      onClick={handleSave}>
                      Guardar
                    </Button>
                  </Grid>
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

        <BootstrapDialog
          fullWidth
          onClose={() => setShow(false)}
          aria-labelledby='customized-dialog-title'
          open={show}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => setShow(false)}>
            Pasos del formulario
          </BootstrapDialogTitle>
          <DialogContent dividers>
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
        </BootstrapDialog>
      </Container>
    </Grid>
  );
}

export default EditBuilderPreview;
