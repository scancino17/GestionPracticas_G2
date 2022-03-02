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
import { useUser } from '../../providers/User';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { sentApplication } from '../../InternshipStates';
import { FieldTypes, CustomTypes, FormTypes } from '../camps/FormTypes';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useStudent } from '../../providers/Student';
import { RequiredFields } from '../builder_preview/RequiredFields';

function SendApplication({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useUser();
  const [files, setFiles] = useState([]);
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [internshipId, setInternshipId] = useState();
  const { updateCurrentInternship } = useStudent();

  useEffect(() => {
    if (userData) {
      setInternshipId(userData.currentInternship.id);

      if (!edit) {
        function setValue(data, displayName, value) {
          data.form.forEach((tab) =>
            tab.form.forEach((item) => {
              if (item.name === displayName) item.value = value;
            })
          );
        }

        const docRef = doc(db, 'form', userData.careerId);

        getDoc(docRef).then((doc) => {
          const data = doc.data();

          const requiredFields = RequiredFields[FormTypes.ApplicationForm];

          Object.entries(requiredFields).forEach(([key, value]) => {
            if (value.data)
              setValue(data, value.displayName, value.data(userData));
          });

          if (data) setFormFull(data.form);
        });
      } else {
        const docRef = doc(db, 'applications', applicationId);
        getDoc(docRef).then((doc) => {
          const data = doc.data();
          if (data) setFormFull(data.form);
        });
      }
    }
  }, [userData, applicationId, edit]);

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
  function saveFiles(applicationId) {
    files.forEach((file) => {
      storage
        .ref()
        .child(
          //en la ruta se accede a la carpeta del estudiante luego a las de la intership luego a las de las aplications
          //luego se entra a la de aplication correspondiente, dentro de esta hay carpetas para cada campo de archivos para poder
          //diferenciarlos y finalmente se guardan ahi con su nombre correspondiente
          `/students-docs/${user.uid}/${internshipId}/applications/${applicationId}/${file.campName}/${file.file.name}`
        )
        .put(file.file);
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

    function findInForm(displayName) {
      let value;

      formFull.forEach((tab) =>
        tab.form.forEach((item) => {
          if (!value && item.name === displayName) value = item.value;
        })
      );

      return value;
    }

    if (!edit) {
      const requiredFields = RequiredFields[FormTypes.ApplicationForm];

      const requiredValues = {};
      Object.entries(requiredFields).forEach(
        ([key, value]) =>
          (requiredValues[value.propName] = value.data
            ? value.data(userData)
            : findInForm(value.displayName))
      );

      addDoc(collection(db, 'applications'), {
        form: formFull,
        studentId: user.uid,
        studentName: userData.name,
        email: userData.email,
        careerId: userData.careerId,
        internshipId: internshipId,
        internshipNumber: userData.currentInternship.number,
        status: 'En revisión',
        creationDate: serverTimestamp(),
        ...requiredValues,
        ...values
      })
        .then((docRef) => {
          //se guarda los archivos en la application correspondiente
          saveFiles(docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    } else {
      updateDoc(doc(db, 'applications', applicationId), {
        form: formFull,
        status: 'En revisión',
        creationDate: serverTimestamp(),
        ...values
      }).then(() =>
        //se guarda los archivos en la application correspondiente
        saveFiles(applicationId)
      );
    }

    updateCurrentInternship({ status: sentApplication });
  }

  return (
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
        <Typography variant='h4'>Formulario</Typography>
      </Grid>

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
                        Swal.fire('¡Formulario enviado!', '', 'success').then(
                          (result) => {
                            if (result.isConfirmed) navigate('/');
                          }
                        );
                      }
                    });
                  }}>
                  Enviar
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}

export default SendApplication;
