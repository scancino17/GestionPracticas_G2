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
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  approvedIntention,
  availableInternship,
  deniedIntention,
  finishedInternship,
  pendingApplication,
  pendingIntention
} from '../InternshipStates';
import InternshipIntentionFileList from './extras/InternshipIntentionFileList';
import StudentIntention from './extras/StudentIntentionButton';
import EmptyHome from './EmptyHome';
import { RiSurveyLine } from 'react-icons/ri';
import useAuth from '../providers/Auth';

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
  secondaryDeniedHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#cf0000'
  },
  secondaryApprovedHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#2cab00'
  },
  secondaryPendingApprovalHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#cbc201'
  },
  secondaryAvailableHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#6782bc'
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
  },
  icon: {
    fontSize: '3rem',
    marginRight: '1rem',
    '@media (max-width: 480px)': {
      fontSize: '2rem'
    }
  }
}));

const InternshipState = ({ internships }) => {
  const [expanded, setExpanded] = useState();
  const [pending, isPending] = useState(false);

  useEffect(() => {
    isPending(
      internships.filter(
        (item) =>
          item.status === pendingIntention || item.status === approvedIntention
      ).length > 0
    );
  }, [internships]);

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
          forceDisable={pending}
        />
      ))}
    </Grid>
  );
};

const IntentionItem = ({
  internship,
  expanded,
  changeExpanded,
  forceDisable
}) => {
  const classes = useStyles();

  const selectDetails = () => {
    switch (internship.status) {
      case approvedState:
        return <ApprovedState />;
      case pendingApprovalState:
        return <PendingState />;
      case deniedState:
        return <DeniedState />;
      case availableInternship:
        return <AvailableState />;
      case finishedInternship:
        return <FinishedState />;
      default:
        return (
          <Typography>
            Que raro, habíamos pensado que esto no podía ocurrir D:
          </Typography>
        );
    }
  };

  const FinishedState = () => {
    const { userData } = useAuth();
    const [survey, setSurvey] = useState([]);

    useEffect(() => {
      db.collection('careers')
        .doc(userData.careerId)
        .onSnapshot((doc) => setSurvey(doc.data()));
    }, []);

    return (
      <Grid container direction='column'>
        <Grid item container direction='row' justify='flex-start'>
          <Typography>
            ¡Felicitaciones! Terminaste tu proceso de practica
          </Typography>
        </Grid>
        <Typography variant='h5'>Tu nota es: {internship.grade}</Typography>
        {internship.reason && (
          <Grid item style={{ paddingTop: '1rem' }}>
            <Typography>
              Tu evaluación tiene las siguientes observaciones:
            </Typography>
            <Typography className={classes.reasonText}>
              {internship.reason}
            </Typography>
          </Grid>
        )}

        <Grid
          container
          style={{
            cursor: 'pointer',
            paddingTop: '2rem',
            paddingBottom: '1rem'
          }}
          onClick={() => (window.location.href = survey.satisfactionSurvey)}>
          <Grid item>
            <RiSurveyLine className={classes.icon} />
          </Grid>
          <Grid item direction='column'>
            <Typography variant='h6'>Responder Encuesta</Typography>
            <Typography variant='body2'>
              Cuéntanos tu experiencia durante las semanas de práctica.
            </Typography>
          </Grid>
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

  const AvailableState = () => {
    return (
      <Grid>
        <Typography>
          Declara tu intención de práctica con el botón "Informar intención de
          práctica".
        </Typography>
        <Typography>
          Tu encargado de práctica revisrá si cumples con los requisitos para
          realizarla.
        </Typography>
      </Grid>
    );
  };

  const ApprovedState = () => {
    return (
      <Grid container direction='column' spacing={2}>
        <Grid item container justify='flex-start' spacing={2}>
          <Typography variant='h4'>
            ¡Felicitaciones! Tu intención de práctica ha sido&nbsp;
            <span className={classes.approvedText}>Aprobada</span>
          </Typography>
        </Grid>
        {internship.reason && (
          <Grid item style={{ paddingTop: '1rem' }}>
            <Typography>
              Tu intención ha sido aprobada con las siguientes observaciones:
            </Typography>
            <Typography className={classes.reasonText}>
              {internship.reason}
            </Typography>
          </Grid>
        )}
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
          <Typography>Observaciones:</Typography>
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
      case availableInternship:
        return <AvailableActions />;
      default:
        return <></>;
    }
  };

  const AvailableActions = () => {
    return (
      <StudentIntention practica={internship} forceDisable={forceDisable} />
    );
  };

  const ApprovedActions = () => {
    const handleStartInternship = (e) => {
      e.preventDefault();
      db.collection('internships')
        .doc(internship.id)
        .update({ status: pendingApplication });
      db.collection('users').doc(internship.studentId).update({ step: 1 });
    };

    return (
      <Button
        color='primary'
        variant='contained'
        onClick={handleStartInternship}>
        Comenzar proceso de práctica
      </Button>
    );
  };

  const DeniedActions = () => {
    return (
      <StudentIntention
        practica={internship}
        altText='Volver a intentar'
        forceDisable={forceDisable}
      />
    );
  };

  const Emoji = (props) => (
    <span
      className='emoji'
      role='img'
      aria-label={props.label ? props.label : ''}
      aria-hidden={props.label ? 'false' : 'true'}>
      {props.symbol}
    </span>
  );

  const StateIcon = () => {
    switch (internship.status) {
      case approvedState:
        return (
          <Typography className={classes.secondaryApprovedHeading}>
            {internship.status + ' '}
            <Emoji symbol='✔️' />
          </Typography>
        );
      case pendingApprovalState:
        return (
          <Typography className={classes.secondaryPendingApprovalHeading}>
            {internship.status + ' '}
            <Emoji symbol='📨' />
          </Typography>
        );
      case deniedState:
        return (
          <Typography className={classes.secondaryDeniedHeading}>
            {internship.status + ' '}
            <Emoji symbol='❌' />
          </Typography>
        );
      case availableInternship:
        return (
          <Typography className={classes.secondaryAvailableHeading}>
            {internship.status + ' '}
            <Emoji symbol='📑' />
          </Typography>
        );
      case finishedInternship:
        return (
          <Typography className={classes.secondaryAvailableHeading}>
            {internship.status + ' '}
            <Emoji symbol='😄' />
          </Typography>
        );
      default:
        return (
          <Typography>
            Que raro, habíamos pensado que esto no podía ocurrir D:
          </Typography>
        );
    }
  };

  return (
    <Accordion
      expanded={expanded === internship.id}
      onChange={changeExpanded(internship.id)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>
          Estado de práctica {internship.internshipNumber}
        </Typography>
        {StateIcon()}
      </AccordionSummary>
      <AccordionDetails>{selectDetails()}</AccordionDetails>
      <AccordionActions>{selectActions()}</AccordionActions>
    </Accordion>
  );
};

function InternshipIntention({ internships }) {
  const [noneDeclarated, isNoneDeclarated] = useState(true);
  useEffect(() => {
    isNoneDeclarated(
      internships.filter((item) => !(item.status === availableInternship))
        .length === 0
    );
  }, [internships]);

  return (
    <>
      {noneDeclarated ? (
        <EmptyHome practicas={internships} />
      ) : (
        <Container style={{ padding: '2rem' }}>
          <Grid container direction='column' spacing={6}>
            <Grid item>
              <Typography variant='h4'>
                Estado de intención de práctica
              </Typography>
            </Grid>
            <Grid item>
              <InternshipState internships={internships} />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}

export default InternshipIntention;
