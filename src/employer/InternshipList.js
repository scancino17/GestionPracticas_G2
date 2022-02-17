import {
  makeStyles,
  withStyles,
  Button,
  Container,
  Grid,
  Hidden,
  Typography,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Box,
  DialogTitle,
  DialogActions,
  Collapse,
  IconButton
} from '@material-ui/core';
import classNames from 'classnames';
import { grey } from '@material-ui/core/colors';
import { ExpandMore } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployer } from '../providers/Employer';
import { useUser } from '../providers/User';
import {
  rutFormatter,
  toLegibleDate,
  toLegibleTime
} from '../utils/FormatUtils';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    [theme.breakpoints.up('sm')]: { flexBasis: '33.33%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('sm')]: { flexBasis: '33.33%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  endDateHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#de6363',
    [theme.breakpoints.up('sm')]: { flexBasis: '33.33%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  bold: {
    fontWeight: 600
  },
  redText: {
    fontSize: theme.typography.pxToRem(15),
    color: '#cf0000'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}));

const SecondaryButton = withStyles((theme) => ({
  root: {
    color: grey[700]
  }
}))(Button);

function InternItem({ internship, expanded, changeExpanded }) {
  const classes = useStyles();
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [expandedRemark, setExpandedRemark] = useState(false);
  const navigate = useNavigate();

  function closeModal() {
    setShowRemarkModal(false);
  }

  function changeExpandedRemark() {
    setExpandedRemark((prevState) => !prevState);
  }

  const {
    internshipId,
    studentName,
    studentRut,
    studentCareer,
    internStart,
    internEnd,
    employerEvaluated
  } = internship;

  return (
    <>
      <Accordion
        expanded={expanded === internshipId}
        onChange={changeExpanded(internshipId)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>{studentName}</Typography>
          <Hidden smDown>
            <Typography className={classes.secondaryHeading}>
              {studentCareer}
            </Typography>
          </Hidden>
          <Typography className={classes.endDateHeading}>
            {`Fecha de término: ${toLegibleDate(internEnd)}`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
              <Typography variant='h6'>Detalles de practicante</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Nombre:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{studentName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Rut:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{rutFormatter(studentRut)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Carrera:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{studentCareer}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Fecha de inicio:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{toLegibleDate(internStart)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Fecha de término:
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.redText}>
              <Typography>{toLegibleDate(internEnd)}</Typography>
            </Grid>
            <LastRemarkView
              internshipId={internshipId}
              expanded={expandedRemark}
              changeExpanded={changeExpandedRemark}
            />
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button
            color='primary'
            onClick={() => navigate(`/remark-history/${internshipId}`)}>
            Historial de observaciones
          </Button>
          <Button color='primary' onClick={() => setShowRemarkModal(true)}>
            Agregar observación
          </Button>
          <Button
            color='primary'
            onClick={() => navigate(`/send-evaluation/${internshipId}`)}
            disabled={employerEvaluated}>
            {employerEvaluated ? 'Evaluación enviada' : 'Responder evaluación'}
          </Button>
        </AccordionActions>
      </Accordion>
      <RemarkModal
        internship={internship}
        closeModal={closeModal}
        showRemarkModal={showRemarkModal}
      />
    </>
  );
}

function LastRemarkView({ internshipId }) {
  const { remarksMap } = useEmployer();
  const remarkList = remarksMap.get(internshipId);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  function handleExpand(event) {
    event.preventDefault();
    setExpanded((prevState) => !prevState);
  }

  return (
    remarkList.length && (
      <>
        <Grid
          item
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          style={{ cursor: 'pointer' }}
          onClick={handleExpand}>
          <Grid item>
            <Typography variant='h6'>Última observación: </Typography>
          </Grid>
          <Grid item>
            <IconButton
              className={classNames(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              style={{ marginRight: '-.75rem' }}
              onClick={handleExpand}>
              <ExpandMore />
            </IconButton>
          </Grid>
        </Grid>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <Grid item container>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Enviado:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>
                {`${toLegibleDate(remarkList[0].id)} ${toLegibleTime(
                  remarkList[0].id
                )}`}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Estado:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>
                {remarkList[0].read ? 'Leído' : 'No Leído'}
              </Typography>
            </Grid>
            {remarkList[0].read && (
              <>
                <Grid item xs={4}>
                  <Typography className={classes.bold}>
                    Recibido por:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {remarkList[0].evaluatingSupervisor.name}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.bold}>Correo:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {remarkList[0].evaluatingSupervisor.email}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.bold}>
                    Última actualización:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    {`${toLegibleDate(
                      remarkList[0].updateTime
                    )} ${toLegibleTime(remarkList[0].updateTime)}`}
                  </Typography>
                </Grid>
              </>
            )}
            <Grid item xs={12} style={{ paddingTop: '1rem' }}>
              <Typography variant='h6'>Mensaje:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{remarkList[0].remark}</Typography>
            </Grid>
            {!!remarkList[0].answer && (
              <>
                <Grid item xs={12} style={{ paddingTop: '1rem' }}>
                  <Typography variant='h6'>Respuesta de supervisor:</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{remarkList[0].answer}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </>
    )
  );
}

function RemarkModal({ internship, closeModal, showRemarkModal }) {
  const [remark, setRemark] = useState('');
  const { addRemark } = useEmployer();

  function handleSubmit() {
    addRemark(internship, remark);
    setRemark('');
    closeModal();
  }

  function handleRemarkChange(event) {
    event.preventDefault();
    setRemark(event.target.value);
  }

  return (
    <Dialog fullWidth open={showRemarkModal} onClose={closeModal}>
      <DialogTitle>Enviar observación a supervisor de escuela</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Puede enviar un comentario respecto al estudiante{' '}
          <Box fontWeight='fontWeightBold' display='inline'>
            {internship.studentName}
          </Box>{' '}
          a su correspondiente supervisor de escuela a través de este medio.
        </DialogContentText>
        <TextField
          multiline
          minRows={4}
          label='Observación'
          variant='outlined'
          onChange={handleRemarkChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
        <Button color='primary' onClick={handleSubmit}>
          Enviar observación
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InternshipList() {
  const { displayName } = useUser();
  const { employerLoaded, internList } = useEmployer();
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  useEffect(() => {
    setExpanded(internList.length ? internList[0].internshipId : false);
  }, [internList]);

  return (
    <>
      <Hidden smDown>
        <Grid
          style={{
            backgroundImage: "url('HomeBanner-3x.png')",
            backgroundColor: '#e0f3f7',
            backgroundSize: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            padding: '2rem'
          }}>
          <Typography variant='h4'>¡Bienvenido/a, {displayName}!</Typography>
          <Typography variant='h5'>
            Evaluación de desempeño de practicantes
          </Typography>
        </Grid>
      </Hidden>
      {employerLoaded ? (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          {internList.map((internship, index) => (
            <InternItem
              key={index}
              internship={internship}
              expanded={expanded}
              changeExpanded={changeExpanded}
            />
          ))}
        </Container>
      ) : (
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          direction='column'
          style={{ marginTop: '4rem' }}>
          <Skeleton
            variant='rect'
            animation='wave'
            height='5rem'
            width='75%'
            style={{ marginBottom: '2rem' }}
          />
          <Skeleton animation='wave' width='75%' height='2rem' />
          <Skeleton animation='wave' width='75%' height='2rem' />
          <Skeleton animation='wave' width='75%' height='2rem' />
        </Grid>
      )}
    </>
  );
}

export default InternshipList;
