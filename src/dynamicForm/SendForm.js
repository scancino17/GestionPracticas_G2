import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db, storage } from '../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Container
} from '@material-ui/core';
import useAuth from '../providers/Auth';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { sentApplication } from '../InternshipStates';
import { ContactsOutlined } from '@material-ui/icons';

function SendForm({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useAuth();
  const [files, setFiles] = useState([]);
  const { internshipId } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!edit) {
      db.collection('form')
        .doc(userData.careerId)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data) setFormFull(data.form);
        });
    } else {
      db.collection('applications')
        .doc(internshipId)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data) setFormFull(data.form);
        });
    }

    db.collection('internships')
      .doc(userData.currentInternship.id)
      .update({ status: sentApplication });
  }, []);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  function saveFiles(applicationId) {
    formFull.map((step) =>
      step.form.map((camp) => {
        if (camp.type === 'File') {
          if (camp.value) {
            camp.value.map(
              (value) => console.log(value)
              /*storage
                .ref()
                .child(
                  `/students-docs/${formFull.name}/${userData.currentInternship.id}/applications/${applicationId}/${value.name}`
                )
                .put(value)*/
            );
          }
        }
      })
    );
  }
  function handleSave() {
    if (!edit) {
      db.collection('applications')
        .add({
          form: formFull,
          student: user.uid,
          email: userData.email,
          careerId: userData.careerId
        })
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id);
          saveFiles(docRef.id);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    } else {
      db.collection('applications').doc(internshipId).set({
        form: formFull,
        student: user.uid
      });
    }
  }

  return (
    <Container>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{ margin: '2rem' }}>
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
        <>
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
          <Button variant='contained' color='primary' onClick={saveFiles}>
            Save File
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={activeStep === 0}
            onClick={handleBack}>
            Anterior
          </Button>
          {activeStep !== formFull.length - 1 && (
            <Button variant='contained' color='primary' onClick={handleNext}>
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
                  showDenyButton: true,
                  confirmButtonText: `Enviar`,
                  denyButtonText: `Salir`
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSave();
                    Swal.fire('¡Formulario enviado!', '', 'success').then(
                      (result) => {
                        if (result.isConfirmed) history.push('/');
                      }
                    );
                  } else if (result.isDenied) {
                    Swal.fire(
                      'Revisa bien tu formulario antes de enviarlo',
                      '',
                      'info'
                    );
                  }
                });
              }}>
              Enviar
            </Button>
          )}
        </>
      )}
    </Container>
  );
}

export default SendForm;
