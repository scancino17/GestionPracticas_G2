import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Hidden from '@material-ui/core/Hidden';
import Tooltip from '@material-ui/core/Tooltip';

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
    <Container maxWidth='lg'>
      <Grid className='border rounded' style={{ marginTop: '3rem' }}>
        <Typography
          variant='h4'
          style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          Práctica X: Google
        </Typography>
        <Hidden smDown>
          <Typography
            className='text-muted small'
            variant='p'
            style={{ marginTop: '1rem', marginLeft: '1rem' }}>
            Supervisor: Sundar Pichai · Dirección: Palo Alto, CA · Modalidad:
            Remoto
          </Typography>
        </Hidden>
        <hr />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <Tooltip title={label} aria-label={label}>
                <StepLabel></StepLabel>
              </Tooltip>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Container>
  );
}
export default CustomStepper;
