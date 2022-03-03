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
import { useStudent } from '../providers/Student';
import { toLegibleDate } from '../utils/FormatUtils';
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
        return ApprovedState();
      case pendingApprovalState:
        return PendingState();
      case deniedState:
        return DeniedState();
      case availableInternship:
        return AvailableState();
      case finishedInternship:
        return FinishedState();
      default:
        return (
          <Typography>
            Que raro, habíamos pensado que esto no podía ocurrir D:
          </Typography>
        );
    }
  };

  const FinishedState = () => {
    return (
      <Grid container direction='column'>
        <Grid item container direction='row' justifyContent='flex-start'>
          <Typography>
            {`${
              internship.approved ? '¡Felicitaciones!' : ''
            }Terminaste tu proceso de práctica`}
          </Typography>
        </Grid>
        <Typography variant='h5'>
          Tu nota es:&nbsp;
          {internship.grade.toString()[0]},{internship.grade.toString()[1]}
          &nbsp;
          {internship.grade < 20
            ? '😰'
            : internship.grade < 30
            ? '😢'
            : internship.grade < 35
            ? '🙁'
            : internship.grade < 40
            ? '😬'
            : internship.grade < 50
            ? '😐'
            : internship.grade < 60
            ? '🙂'
            : internship.grade < 65
            ? '😃'
            : internship.grade >= 65
            ? '🤩'
            : null}
        </Typography>
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
          item
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          style={{ paddingTop: '1rem' }}>
          <Typography className={classes.evaluatingSupervisorText}>
            Evaluado por {internship.evaluatingSupervisor.name}
          </Typography>
          <Typography className={classes.evaluatingSupervisorText}>
            {internship.evaluatingSupervisor.email}
          </Typography>
        </Grid>
        {internship.evaluatedReportTime && (
          <Typography className={classes.evaluatingSupervisorText}>
            {toLegibleDate(internship.evaluatedReportTime)}
          </Typography>
        )}
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
        <Grid item container justifyContent='flex-start' spacing={2}>
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
          justifyContent='space-between'
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
        <Typography>Nosotros te avisamos cuando terminen ;)</Typography>
      </Grid>
    );
  };

  const DeniedState = () => {
    return (
      <Grid container direction='column'>
        <Grid item container direction='row' justifyContent='flex-start'>
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
          justifyContent='space-between'
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
        return ApprovedActions();
      case deniedState:
        return DeniedActions();
      case availableInternship:
        return AvailableActions();
      case finishedInternship:
        return !internship.approved ? (
          !internship.disabled ? (
            FinishedActions()
          ) : (
            <></>
          )
        ) : (
          <></>
        );
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
    const { updateInternship, updateUser } = useStudent();

    const handleStartInternship = (e) => {
      e.preventDefault();
      updateInternship(internship.id, { status: pendingApplication });
      updateUser({ step: 1 });
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
  const FinishedActions = () => {
    return (
      <StudentIntention
        reprove={!internship.approved}
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
            {internship.approved
              ? internship.status + ' '
              : 'Práctica reprobada'}
            <Emoji symbol={!internship.approved ? '😢' : '😄'} />
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

function InternshipIntention() {
  const { internships } = useStudent();

  /*
const [noneDeclarated, isNoneDeclarated] = useState(true);
  useEffect(() => {
    isNoneDeclarated(
      internships.filter((item) => !(item.status === availableInternship))
        .length === 0
    );
  }, [internships]);

*/
  return (
    <>
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
    </>
  );
}

export default InternshipIntention;
