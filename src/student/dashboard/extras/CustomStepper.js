import { Step, StepLabel, Stepper, Tooltip } from '@material-ui/core';
import React from 'react';

function CustomStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  function getSteps() {
    return [
      'Práctica Declarada',
      'Completando Formularios',
      'Práctica en Curso',
      'Práctica Terminada'
    ];
  }

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <Tooltip title={label} aria-label={label}>
            <StepLabel />
          </Tooltip>
        </Step>
      ))}
    </Stepper>
  );
}
export default CustomStepper;
