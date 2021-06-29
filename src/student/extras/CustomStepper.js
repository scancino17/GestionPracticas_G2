import { Step, StepLabel, Stepper, Hidden } from '@material-ui/core';
import React from 'react';

function CustomStepper({ step }) {
  const steps = [
    'Declarar intención de práctica',
    'Postular una práctica',
    'Práctica en curso',
    'Evaluación de práctica',
    'Práctica Terminada'
  ];

  return (
    <Stepper
      activeStep={step}
      alternativeLabel
      style={{ background: 'transparent' }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>
            <Hidden smDown>{label}</Hidden>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default CustomStepper;
