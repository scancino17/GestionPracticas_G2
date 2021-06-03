import React, { useEffect, useState } from 'react';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
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

function SendForm({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useAuth();
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

  function handleSave() {
    if (!edit) {
      db.collection('applications').add({
        form: formFull,
        studentId: user.uid,
        email: userData.email,
        careerId: userData.careerId,
        internshipId: internshipId
      });
    } else {
      db.collection('applications').doc(internshipId).set({ form: formFull });
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
                  student
                />
              )
          )}
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
