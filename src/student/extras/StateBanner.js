import React, { useEffect, useState } from 'react';
import { makeStyles, Typography, Grid, Paper, Box } from '@material-ui/core';
import { useStudent } from '../../providers/Student';
import * as internshipStates from '../../InternshipStates';

const useStyles = makeStyles((theme) => ({
  card: {
    background: 'var(--background)',
    padding: '1rem'
  }
}));

const infoColor = {
  '--background': '#bbdefb'
};

const warningColor = {
  '--background': '#ffecb3'
};

const successColor = {
  '--background': '#c8e6c9'
};

const failureColor = {
  '--background': '#ffcdd2'
};

const states = {
  [`${internshipStates.pendingApplication}`]: {
    color: warningColor,
    message: 'Ya está disponible el formulario inscripción de práctica.',
    hide: false,
    showReason: false
  },
  [`${internshipStates.sentApplication}`]: {
    color: infoColor,
    message: 'Tu inscripción de práctica está siendo evaluada.',
    hide: false,
    showReason: false
  },
  [`${internshipStates.approvedApplication}`]: {
    color: successColor,
    message: 'Se ha aprobado tu inscripción de práctica.',
    hide: false,
    showReason: true,
    applicationReason: true,
    reasonLabel: 'Observaciones'
  },
  [`${internshipStates.changeDetailsApplication}`]: {
    color: warningColor,
    message: 'Se han solicitado cambios en la práctica inscrita.',
    hide: false,
    showReason: true,
    applicationReason: true,
    reasonLabel: 'Cambios solicitados'
  },
  [`${internshipStates.deniedApplication}`]: {
    color: failureColor,
    message: 'Se ha rechazado tu inscripción de práctica.',
    hide: false,
    showReason: true,
    applicationReason: true,
    reasonLabel: 'Razón de rechazo'
  },
  [`${internshipStates.authorizedInternship}`]: {
    color: infoColor,
    message: 'Se ha autorizado la ejecución de tu práctica.',
    hide: false,
    showReason: false
  },
  [`${internshipStates.onGoingIntenship}`]: {
    color: infoColor,
    message: 'Se está cursando tu práctica',
    hide: false,
    showReason: false
  },
  [`${internshipStates.sentReport}`]: {
    color: infoColor,
    message: 'Tu informe de práctica esta siendo evaluado.',
    hide: false,
    showReason: false
  },
  [`${internshipStates.reportNeedsChanges}`]: {
    color: warningColor,
    message: 'Se han solicitado cambios en tu informe de práctica.',
    hide: false,
    showReason: false,
    reasonLabel: 'Cambios solicitados'
  },
  [`${internshipStates.evaluatedInternship}`]: {
    color: warningColor,
    message: 'Se ha evaluado tu práctica.',
    hide: false,
    showReason: false,
    showGrade: true,
    reasonLabel: 'Comentarios'
  },
  [`${internshipStates.finishedInternship}`]: {
    color: warningColor,
    message: '¡Felicitaciones! Tu práctica ha finalizado.',
    hide: false,
    showReason: false,
    showGrade: true,
    reasonLabel: 'Comentarios'
  },
  [`${internshipStates.sentExtension}`]: {
    color: infoColor,
    message: 'Se está evaluando tu solicitud de extensión práctica.',
    hide: false,
    showReason: false
  },
  [`${internshipStates.approvedExtension}`]: {
    color: successColor,
    message: 'Se ha aprobado tu solicitud de extensión de práctica.',
    hide: false,
    showReason: true,
    reasonLabel: 'Observaciones'
  },
  [`${internshipStates.deniedExtension}`]: {
    color: failureColor,
    message: 'Se ha rechazado tu solicitud de extensión de práctica.',
    hide: false,
    showReason: true,
    reasonLabel: 'Razón de rechazo'
  }
};

function StateBanner() {
  const classes = useStyles();
  const [internshipState, setInternshipState] = useState('');
  const [reason, setReason] = useState('');
  const [grade, setGrade] = useState('');
  const { currentInternshipData: data, lastApplication } = useStudent();

  useEffect(() => {
    let state = data.extensionStatus ? data.extensionStatus : data.status;
    setInternshipState(state);

    if (states[state]?.applicationReason) {
      setReason(lastApplication.reason);
    } else {
      setReason(data.extensionStatus ? data.reasonExtension : data.reason);
    }

    !!data.grade && setGrade(data.grade);
  }, [data, lastApplication]);

  return (
    !!states[internshipState] &&
    !states[internshipState].hide && (
      <Grid item>
        <Paper className={classes.card} style={states[internshipState].color}>
          <Grid container direction='column'>
            <Grid item>
              <Typography variant='h6'>
                {states[internshipState].message}
              </Typography>
            </Grid>
            {states[internshipState].showReason && reason && (
              <Grid item>
                <Typography>
                  <Box fontSize='h6.fontSize'>
                    {`${states[internshipState].reasonLabel}: `}
                    <Box fontStyle='italic'>{reason}</Box>
                  </Box>
                </Typography>
              </Grid>
            )}
            {states[internshipState].showGrade && (
              <Grid item>
                <Typography>
                  <Box fontSize='h6.fontSize'>
                    Tu nota es:
                    <Box fontWeight='Bold'>{grade}</Box>
                  </Box>
                  <Box fontSize='h6.fontSize'>
                    {`${states[internshipState].reasonLabel}: `}
                    <Box fontStyle='italic'>{reason}</Box>
                  </Box>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    )
  );
}

export default StateBanner;
