import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button
} from '@material-ui/core';

function SendForm() {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const { careerId } = useParams();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    db.collection('form')
      .doc(careerId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) setFormFull(data.form);
      });
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
    db.collection('form').doc(careerId).set({ form: formFull });
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
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
                <DynamicForm
                  setForm={setFormFull}
                  form={form.form}
                  formFull={formFull}
                  index={i}
                />
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
    </>
  );
}

export default SendForm;
