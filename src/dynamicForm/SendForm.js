import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import useAuth from '../providers/Auth';
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

  useEffect(() => {
    db.collection('form')
      .doc(careerId)
      .get()
      .then((doc) => {
        const data = doc.data();
        console.log(data);
        if (data) {
          setFormFull(data.form);
        }
      });
  }, []);
  useEffect(() => {
    console.log(formFull);
    setFlag(false);
  }, [flag]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  function getFormFull() {
    return formFull;
  }
  async function handleSave() {
    console.log(formFull);
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
      <div>
        {activeStep === formFull.length ? (
          <div>
            <Typography>Guardar</Typography>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Guardar
            </Button>
          </div>
        ) : (
          <div>
            {formFull.map(
              (form, i) =>
                i === activeStep && (
                  <DynamicForm
                    setForm={setFormFull}
                    form={form.form}
                    formFull={getFormFull}
                    index={i}
                  />
                )
            )}
            <div>
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SendForm;
