import React, { useEffect, useState } from 'react';
import DynamicForm from '../builder_preview/DynamicForm';
import { db, storage } from '../../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  TextField,
  Slider,
  Container,
  Input,
  Grid
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldTypes, CustomTypes } from '../camps/FormTypes';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useEmployer } from '../../providers/Employer';
import { useUser } from '../../providers/User';
import { ref, uploadBytes } from 'firebase/storage';
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
function SendEvaluation({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [evaluateComment, setEvaluateComment] = useState('');
  const navigate = useNavigate();
  const { internshipId } = useParams();

  const [loaded, setLoaded] = useState(false);
  const { evaluationForms, getInternData, updateInternData } = useEmployer();
  const { userId } = useUser();
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [qualification, setQualification] = useState(40);

  useEffect(() => {
    if (internshipId) {
      const internData = getInternData(internshipId);
      if (internData) {
        const form = evaluationForms.get(internData.careerId);
        setFormFull(form);
        setLoaded(true);
      }
    }
  }, [evaluationForms, getInternData, internshipId]);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleNext() {
    if (dataVerify()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops... parece que te falta algo',
        text: 'Son requeridos todos los campos'
      });
    }
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  //se extraen los archivos del formfull para tenerlos en una lista aparte para poder subirlos al storage
  function extractFiles() {
    formFull.forEach((step, i) =>
      step.form.forEach((camp, j) => {
        if (camp.type === FieldTypes.formFileInput) {
          if (camp.value && !(typeof camp.value === 'string')) {
            files.push({ campName: camp.name, file: camp.value[0] });
            //se tiene que cambiar el valor de value en el formulario ya que nos se puede guardar un archivo en el firestore
            //tambien ese name sirve para poder buscar el archivo
            formFull[i].form[j].value = camp.value[0].name;
          }
        }
      })
    );
  }
  //se guardan los archivos en el storage
  function saveFiles(evaluateId) {
    files.forEach((file) => {
      //en la ruta se accede a la carpeta del estudiante luego a las de la intership luego a las de las aplications
      //luego se entra a la de aplication correspondiente, dentro de esta hay carpetas para cada campo de archivos para poder
      //diferenciarlos y finalmente se guardan ahi con su nombre correspondiente
      const storageRef = ref(
        storage,
        `/students-docs/${userId}/${internshipId}/evaluate/${evaluateId}/${file.campName}/${file.file.name}`
      );
      uploadBytes(storageRef, file.file);
    });
  }
  function dataVerify() {
    if (formFull != null) {
      for (let i = 0; i < formFull[activeStep].form.length; i++) {
        if (
          formFull[activeStep].form[i].value === '' &&
          formFull[activeStep].form[i].type !== 'Título'
        ) {
          return false;
        }
      }
      return true;
    }
  }
  function handleSave() {
    //extraemos los archivos antes de guardar el formulario para poder cambiar el valor del value en los campos files ya que
    //firestore no lo soporta
    extractFiles();
    const values = {};
    formFull.forEach((step) =>
      step.form.forEach((camp) => {
        if (
          camp.type === FieldTypes.formCustom &&
          (camp.type2 === CustomTypes.formStartDate ||
            camp.type2 === CustomTypes.formEndDate) &&
          camp.value === ''
        )
          camp.value = new Date();
        values[camp.name] = camp.value;
      })
    );

    if (!edit) {
      const internData = getInternData(internshipId);
      addDoc(collection(db, 'send-evaluation'), {
        careerId: internData.careerId,
        studentId: internData.studentId,
        internshipId: internshipId,
        employerId: userId,
        read: false,
        form: formFull,
        sentTime: serverTimestamp()
      })
        .then((docRef) => {
          //se guarda los archivos en la application correspondiente
          saveFiles(docRef.id);
          updateDoc(doc(db, 'internships', internshipId), {
            employerEvaluated: true,
            employerEvaluationId: docRef.id,
            employerGrade: qualification,
            employerGradeTime: serverTimestamp(),
            employerEvaluateComment: evaluateComment
          });

          updateInternData(internshipId, {
            employerEvaluated: true,
            evaluationId: docRef.id,
            evaluationTime: serverTimestamp()
          });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
  }

  return (
    <>
      {loaded && (
        <Grid container direction='column'>
          <Grid
            style={{
              backgroundImage: "url('HomeBanner-4x.png')",
              backgroundColor: '#e0f3f7',
              backgroundSize: '100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              padding: '2rem'
            }}>
            <Typography variant='h4'>Formulario evaluación</Typography>
          </Grid>
          {formFull ? (
            <Container>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                style={{ margin: '2rem', backgroundColor: 'transparent' }}>
                {formFull.map((step) => (
                  <Step key={step.step}>
                    <StepLabel>{step.step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
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
                <Grid container direction='column' spacing={2}>
                  <Grid item>
                    {formFull.map(
                      (form, i) =>
                        i === activeStep && (
                          // formview
                          <DynamicForm
                            form={form.form}
                            setForm={setFormFull}
                            formFull={formFull}
                            index={i}
                            filesInner={files}
                            setFilesInner={() => setFiles}
                            student
                          />
                        )
                    )}
                  </Grid>
                  <Grid item container justifyContent='flex-end' spacing={2}>
                    <Grid item>
                      <Button
                        variant='contained'
                        color='primary'
                        disabled={activeStep === 0}
                        onClick={handleBack}>
                        Anterior
                      </Button>
                    </Grid>
                    <Grid item>
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
                            setShowEvaluate(true);
                          }}>
                          Enviar
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Container>
          ) : (
            <Skeleton animation='pulse' width='100%' height='100%' />
          )}
        </Grid>
      )}
      <BootstrapDialog
        fullWidth
        onClose={() => setShowEvaluate(false)}
        aria-labelledby='customized-dialog-title'
        open={showEvaluate}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={() => setShowEvaluate(false)}>
          Evaluar Práctica
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container justifyContent='center' alignContent='center'>
            <Grid item>
              <Typography variant='h2'>
                {qualification < 20
                  ? '😰'
                  : qualification < 30
                  ? '😢'
                  : qualification < 35
                  ? '🙁'
                  : qualification < 40
                  ? '😬'
                  : qualification < 50
                  ? '😐'
                  : qualification < 60
                  ? '🙂'
                  : qualification < 65
                  ? '😃'
                  : qualification >= 65
                  ? '🤩'
                  : null}
              </Typography>
            </Grid>
            <Slider
              min={10}
              max={70}
              marks={[
                { label: '1.0', value: 10 },
                { label: '2.0', value: 20 },
                { label: '3.0', value: 30 },
                { label: '4.0', value: 40 },
                { label: '5.0', value: 50 },
                { label: '6.0', value: 60 },
                { label: '7.0', value: 70 }
              ]}
              value={qualification}
              aria-labelledby='input-slider'
              onChange={(event, newValue) => setQualification(newValue)}
            />
            <Input
              value={qualification}
              margin='dense'
              onChange={(event) =>
                event.target.value <= 70
                  ? setQualification(event.target.value)
                  : null
              }
              inputProps={{
                min: 10,
                max: 70,
                type: 'number'
              }}
            />
          </Grid>
          <Typography
            variant='h5'
            color={qualification < 40 ? 'error' : 'primary'}>
            Evaluar con nota: {qualification / 10}
          </Typography>
          <TextField
            fullWidth
            label='Comentarios'
            multiline
            variant='outlined'
            rows={4}
            onChange={(e) => setEvaluateComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={() => setShowEvaluate(false)}>
            Cancelar
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              handleSave();

              navigate('/');
            }}>
            Confirmar Evaluación
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default SendEvaluation;
