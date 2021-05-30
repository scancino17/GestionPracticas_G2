import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { useState } from 'react';
import { db } from '../../firebase';
import useAuth from '../../providers/Auth';

const pendingApprovalState = 'Pendiente Aprobación';
const approvedState = 'Pendiente';
const deniedState = 'Rechazado';

const InternshipState = ({ internships }) => {
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid>
      {internships.map((internship) => (
        <IntentionItem
          internship={internship}
          expanded={expanded}
          changeExpanded={changeExpanded}
        />
      ))}
    </Grid>
  );
};

const IntentionItem = ({ internship, expanded, changeExpanded }) => {
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
      <Grid>
        <Typography>
          ¡Felicitaciones! Tu intención de práctica ha sido aprobada.
        </Typography>
        <Typography>
          Puedes descargar los archivos necesarios para postular a prácticas a
          continuación.
        </Typography>
        <Typography>
          Evaluado por {internship.evaluatingSupervisor.name}
        </Typography>
        <Typography>{internship.evaluatingSupervisor.email}</Typography>
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
      <Grid>
        <Typography>
          ¡Rayos! Tu intención de práctica ha sido rechazada.
        </Typography>
        <Typography>
          No te preocupes, puedes volver a intentarlo. Tendrás mejores
          resultados si te comunicas directamente con los encargados.
        </Typography>
        <Typography>
          Aquí el por qué del rechazo: {internship.reason}
        </Typography>
        <Typography>
          Evaluado por {internship.evaluatingSupervisor.name}
        </Typography>
        <Typography>{internship.evaluatingSupervisor.email}</Typography>
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
      db.collection('users').doc(user.uid).update({ onGoingIntern: true });
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
        <Typography>
          Estado de práctica {internship.applicationNumber}
        </Typography>
        <Typography>{internship.status}</Typography>
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
