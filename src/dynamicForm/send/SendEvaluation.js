import React, { useEffect, useState } from 'react';
import DynamicForm from '../builder_preview/DynamicForm';
import { db, storage } from '../../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Container,
  Grid
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldTypes, CustomTypes, FormTypes } from '../camps/FormTypes';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useEmployer } from '../../providers/Employer';
import { useUser } from '../../providers/User';
import { ref, uploadBytes } from 'firebase/storage';
import { RequiredFields } from '../builder_preview/RequiredFields';

function SendEvaluation({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const { internshipId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const { evaluationForms, getInternData, updateInternData } = useEmployer();
  const { userId } = useUser();

  useEffect(() => {
    if (internshipId) {
      const internData = getInternData(internshipId);
      if (internData) {
        function setValue(form, displayName, value) {
          form.forEach((tab) =>
            tab.form.forEach((item) => {
              if (item.name === displayName) item.value = value;
            })
          );
        }

        const form = structuredClone(evaluationForms.get(internData.careerId));
        const requiredFields = RequiredFields[FormTypes.EvaluationForm];

        if (form) {
          Object.entries(requiredFields).forEach(([key, value]) => {
            if (value.data)
              setValue(form, value.displayName, value.data(internData));
          });

          setFormFull(form);
          setLoaded(true);
        }
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
            employerEvaluationId: docRef.id
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
    loaded && (
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
                          flag={flag}
                          setFlag={setFlag}
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
                          Swal.fire({
                            title: '¿Desea enviar su solicitud?',
                            text: 'Revisa bien el formulario antes de enviarlo',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: `Enviar`,
                            cancelButtonText: `Cancelar`
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleSave();
                              Swal.fire(
                                '¡Formulario enviado!',
                                '',
                                'success'
                              ).then((result) => {
                                if (result.isConfirmed) navigate('/');
                              });
                            }
                          });
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
    )
  );
}

export default SendEvaluation;
