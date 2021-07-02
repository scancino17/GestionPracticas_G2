import React, { useEffect, useState } from 'react';
import DynamicForm from './DynamicForm';
import { db, storage } from '../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Container,
  Grid
} from '@material-ui/core';
import useAuth from '../providers/Auth';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { sentApplication } from '../InternshipStates';
import { formTypes, customTypes } from './formTypes';
import firebase from 'firebase';

function SendForm({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useAuth();
  const [files, setFiles] = useState([]);
  const { applicationId } = useParams();
  const history = useHistory();
  const [internshipId, setInternshipId] = useState();

  useEffect(() => {
    if (userData) {
      setInternshipId(userData.currentInternship.id);
      if (!edit) {
        db.collection('form')
          .doc(userData.careerId)
          .get()
          .then((doc) => {
            const data = doc.data();
            data.form[0].form[1].value = userData.name;
            data.form[0].form[2].value = userData.rut;
            data.form[0].form[3].value = userData.enrollmentNumber;
            data.form[0].form[4].value = userData.email;
            if (data) setFormFull(data.form);
          });
      } else {
        db.collection('applications')
          .doc(applicationId)
          .get()
          .then((doc) => {
            const data = doc.data();
            if (data) setFormFull(data.form);
          });
      }
    }
  }, [userData]);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  //se extraen los archivos del formfull para tenerlos en una lista aparte para poder subirlos al storage
  function extractFiles() {
    formFull.forEach((step, i) =>
      step.form.forEach((camp, j) => {
        if (camp.type === formTypes.formFileInput) {
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

  function handleSave() {
    //extraemos los archivos antes de guardar el formulario para poder cambiar el valor del value en los campos files ya que
    //firestore no lo soporta
    extractFiles();
    const values = {};
    formFull.forEach((step) =>
      step.form.forEach((camp) => {
        if (
          camp.type === formTypes.formCustom &&
          (camp.type2 === customTypes.formStartDate ||
            camp.type2 === customTypes.formEndDate) &&
          camp.value === ''
        )
          camp.value = new Date();
        values[camp.name] = camp.value;
      })
    );

    if (!edit) {
      db.collection('applications')
        .add({
          form: formFull,
          studentId: user.uid,
          studentName: userData.name,
          email: userData.email,
          careerId: userData.careerId,
          internshipId: internshipId,
          internshipNumber: userData.currentInternship.number,
          status: 'En revisión',
          creationDate: firebase.firestore.FieldValue.serverTimestamp(),
          ...values
        })
        .then(function (docRef) {
          //se guarda los archivos en la application correspondiente
          saveFiles(docRef.id);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    } else {
      db.collection('applications')
        .doc(applicationId)
        .update({ form: formFull, status: 'En revisión', ...values })
        .then(() =>
          //se guarda los archivos en la application correspondiente
          saveFiles(applicationId)
        );
    }
    db.collection('internships')
      .doc(userData.currentInternship.id)
      .update({ status: sentApplication });
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
        {activeStep === formFull.length ? (
          <>
            <Typography>Guardar</Typography>
            <Button variant='contained' color='primary' onClick={handleSave}>
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
            <Grid item container justify='flex-end' spacing={2}>
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
                              if (result.isConfirmed) history.push('/');
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
        )}
      </Container>
    </Grid>
  );
}

export default SendForm;
