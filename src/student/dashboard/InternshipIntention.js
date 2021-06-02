import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { useState } from 'react';
import { db } from '../../firebase';
import {
  approvedIntention,
  deniedIntention,
  pendingIntention
} from '../../InternshipStates';
import useAuth from '../../providers/Auth';
import InternshipIntentionFileList from './extras/InternshipIntentionFileList';

const pendingApprovalState = pendingIntention;
const approvedState = approvedIntention;
const deniedState = deniedIntention;

const useStyles = makeStyles((theme) => ({
  list: {
    padding: '1rem'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  deniedText: {
    fontWeight: 'bold',
    color: theme.palette.error.dark
  },
  approvedText: {
    fontWeight: 'bold',
    color: theme.palette.success.dark
  },
  reasonText: {
    fontStyle: 'oblique'
  },
  evaluatingSupervisorText: {
    color: theme.palette.text.secondary,
    fontWeight: 'medium'
  }
}));

const InternshipState = ({ internships }) => {
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid>
      {internships.map((internship) => (
        <IntentionItem
          key={internship.id}
          internship={internship}
          expanded={expanded}
          changeExpanded={changeExpanded}
        />
      ))}
    </Grid>
  );
};

const IntentionItem = ({ internship, expanded, changeExpanded }) => {
  const classes = useStyles();

  const selectDetails = () => {
    switch (internship.status) {
      case approvedState:
        return <ApprovedState />;
      case pendingApprovalState:
        return <PendingState />;
      case deniedState:
        return <DeniedState />;
      default:
        return (
          <Typography>
            Que raro, no encontramos la intención de esta práctica.
          </Typography>
        );
    }
  };

  const ApprovedState = () => {
    return (
      <Grid container direction='column'>
        <Grid item container direction='row' justify='flex-start'>
          <Typography>
            <Box style={{ paddingRight: '.3rem' }}>
              ¡Felicitaciones! Tu intención de práctica ha sido
            </Box>
          </Typography>
          <Typography>
            <Box className={classes.approvedText}>aprobada.</Box>
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            Puedes descargar los archivos necesarios para postular a prácticas a
            continuación:
          </Typography>
        </Grid>
        <Grid item>
          <InternshipIntentionFileList
            internshipId={internship.id}
            studentId={internship.studentId}
          />
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          alignItems='center'
          style={{ paddingTop: '1rem' }}>
          <Typography className={classes.evaluatingSupervisorText}>
            Evaluado por {internship.evaluatingSupervisor.name}
          </Typography>
          <Typography className={classes.evaluatingSupervisorText}>
            {internship.evaluatingSupervisor.email}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const PendingState = () => {
    return (
      <Grid>
        <Typography>
          Tu intención de práctica todavía está siendo evaluada.
        </Typography>
        <Typography>
          Tranquilo, nosotros te avisamos cuando terminen ;)
        </Typography>
      </Grid>
    );
  };

  const DeniedState = () => {
    return (
      <Grid container direction='column'>
        <Grid item container direction='row' justify='flex-start'>
          <Typography>
            <Box style={{ paddingRight: '.3rem' }}>
              ¡Rayos! Tu intención de práctica ha sido
            </Box>
          </Typography>
          <Typography>
            <Box className={classes.deniedText}>rechazada.</Box>
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            No te preocupes, puedes volver a intentarlo. Tendrás mejores
            resultados si te comunicas directamente con los encargados.
          </Typography>
        </Grid>
        <Grid item style={{ paddingTop: '1rem' }}>
          <Typography>Aquí el por qué del rechazo:</Typography>
          <Typography className={classes.reasonText}>
            {internship.reason}
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          alignItems='center'
          style={{ paddingTop: '1rem' }}>
          <Typography className={classes.evaluatingSupervisorText}>
            Evaluado por {internship.evaluatingSupervisor.name}
          </Typography>
          <Typography className={classes.evaluatingSupervisorText}>
            {internship.evaluatingSupervisor.email}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const selectActions = () => {
    switch (internship.status) {
      case approvedState:
        return <ApprovedActions />;
      case deniedState:
        return <DeniedActions />;
      default:
        return <></>;
    }
  };

  const ApprovedActions = () => {
    const { user } = useAuth();

    const handleStartInternship = (e) => {
      e.preventDefault();
      db.collection('internship').doc(user.uid).update({ onGoingIntern: true });
    };

    return (
      <Button onClick={handleStartInternship}>
        Comenzar proceso de práctica
      </Button>
    );
  };

  const DeniedActions = () => {
    return <Button>Volver a postular</Button>;
  };

  return (
    <Accordion
      expanded={expanded === internship.id}
      onChange={changeExpanded(internship.id)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>
          Estado de práctica {internship.applicationNumber}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          {internship.status}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{selectDetails()}</AccordionDetails>
      <AccordionActions>{selectActions()}</AccordionActions>
    </Accordion>
  );
};

function InternshipIntention({ internships }) {
  return (
    <Container style={{ padding: '2rem' }}>
      <Grid container direction='column' spacing={6}>
        <Grid item>
          <Typography variant='h4'>Estado de intención de práctica</Typography>
        </Grid>
        <Grid item>
          <InternshipState internships={internships} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default InternshipIntention;
