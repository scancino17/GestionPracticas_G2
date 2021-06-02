import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Grid,
  Container
} from '@material-ui/core';
import FormView from './FormView';
import useAuth from '../providers/Auth';

function SendForm({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useAuth();
  const { internshipId } = useParams();

  useEffect(() => {
    if (!edit) {
      db.collection('form')
        .doc('3407')
        .get()
        .then((doc) => {
          const data = doc.data();
          console.log(data);
          if (data) {
            setFormFull(data.form);
            console.log(data);
          }
        });
    } else {
      db.collection('formApplication')
        .doc(internshipId)
        .get()
        .then((doc) => {
          const data = doc.data();
          console.log(data);
          if (data) {
            setFormFull(data.form);
            console.log(data);
          }
        });
    }
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

  function handleSave() {
    if (!edit) {
      db.collection('applications').add({
        form: formFull,
        student: user.uid
      });
    } else {
      db.collection('applications').doc(internshipId).set({
        form: formFull,
        student: user.uid,
        name: user.name,
        email: user.email
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
                <>
                  <DynamicForm
                    form={form.form}
                    setForm={setFormFull}
                    formFull={formFull}
                    index={i}
                    student
                  />
                  <Grid xs={12} md={12} justify='center'>
                    <Button onClick={() => console.log(user)}>Back</Button>
                  </Grid>
                </>
              )
          )}
          <Button
            variant='contained'
            color='primary'
            disabled={activeStep === 0}
            onClick={handleBack}>
            Back
          </Button>
          <Button variant='contained' color='primary' onClick={handleNext}>
            {activeStep === formFull.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </Container>
  );
}

export default SendForm;
