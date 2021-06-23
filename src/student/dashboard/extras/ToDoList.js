import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Hidden,
  TextField,
  Typography,
  Slide
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaWpforms } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { RiSurveyLine } from 'react-icons/ri';
import { makeStyles } from '@material-ui/core/styles';
import useAuth from '../../../providers/Auth';
import { useHistory } from 'react-router-dom';
import { db } from '../../../firebase';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InternshipIntentionFileList, {
  SeguroPracticaFileList
} from './InternshipIntentionFileList';
import DateFnsUtils from '@date-io/date-fns';
import {
  changeDetailsApplication,
  reportNeedsChanges,
  sentApplication,
  deniedApplication,
  pendingApplication,
  sentReport,
  sentExtension,
  deniedExtension,
  approvedExtension
} from '../../../InternshipStates';
import { AlarmAdd, TextFields } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles({
  icon: {
    fontSize: '2rem',
    marginRight: '1rem',
    '@media (max-width: 480px)': {
      fontSize: '1rem'
    }
  },
  button: {
    width: '8rem'
  }
});

function ToDoItem({
  icon,
  title,
  body,
  buttonText,
  buttonOnClick,
  disabled,
  reason,
  reasonExtension,
  internship,
  statusExtension,
  minorChanges
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      style={{ padding: '1rem' }}
      justify='space-between'
      wrap='nowrap'>
      <Grid container>
        <Hidden smDown>
          <Grid item>{icon}</Grid>
        </Hidden>
        <Grid item>
          <Typography variant='h6'>{title}</Typography>
          <Hidden smDown>
            {!reasonExtension && (
              <Typography color='textSecondary' variant='body2'>
                {body}
              </Typography>
            )}
            {reasonExtension && statusExtension === deniedExtension && (
              <>
                <Typography color='error' variant='body2'>
                  Rechazado
                </Typography>
                <Typography variant='body2'>
                  Razón: {reasonExtension}
                </Typography>
              </>
            )}
            {reasonExtension && statusExtension === approvedExtension && (
              <>
                <Typography style={{ color: '#4caf50' }} variant='body2'>
                  Aprovado
                </Typography>
                <Typography variant='body2'>
                  Observacion: {reasonExtension}
                </Typography>
              </>
            )}
            {reason &&
              !(
                internship &&
                internship.status === sentApplication &&
                internship.status !== pendingApplication
              ) && (
                <Typography variant='body1' color='error'>
                  Razón de rechazo: {reason}
                </Typography>
              )}

            {minorChanges && (
              <Typography variant='body1'>
                Cambios necesarios: {minorChanges}
              </Typography>
            )}
          </Hidden>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          className={classes.button}
          variant='outlined'
          color='primary'
          onClick={buttonOnClick}
          disabled={disabled}>
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
}

function ToDoList({ done, reason }) {
  const [internship, setInternship] = useState();
  const { userData } = useAuth();
  const classes = useStyles();
  const [openDocs, setOpenDocs] = useState(false);
  const history = useHistory();
  const [practicalinsurance, setPracticalinsurance] = useState([]);
  const [openSecure, setOpenSecure] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [reasonExtension, setReasonExtension] = useState('');
  const [reasonRequestExtension, setReasonRequestExtension] = useState('');
  const [statusExtension, setStatusExtension] = useState('');
  const [dateExtension, setDateExtension] = useState(new Date());
  const [survey, setSurvey] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('internships')
      .doc(userData.currentInternship.id)
      .onSnapshot((doc) => {
        setInternship(doc.data());
        setReasonExtension(doc.data().reasonExtension);
        setStatusExtension(doc.data().exceptionStatus);
        console.log(doc.data());
      });

    return unsubscribe;
  }, []);
  useEffect(() => {
    db.collection('applications')
      .where('internshipId', '==', userData.currentInternship.id)
      .onSnapshot((doc) =>
        doc.forEach((app) => {
          setPracticalinsurance(app.data());
        })
      );
  }, []);

  function handleSendExtension() {
    db.collection('internships').doc(userData.currentInternship.id).update({
      exceptionStatus: sentExtension,
      dateExtension: dateExtension,
      reasonExtension: reasonRequestExtension
    });
  }

  useEffect(() => {
    db.collection('careers')
      .doc(userData.careerId)
      .onSnapshot((doc) => setSurvey(doc.data()));
  }, []);

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Accordion>
          <AccordionSummary
            expandIcon={<FaChevronDown />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography variant='h5'>Lista de Pendientes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {done ? (
              <Grid container direction='column' alignItems='center'>
                <img src='AllDone.png' alt='Vacio' />
                <Typography variant='h6'>
                  No tienes tareas pendientes de momento.
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                  Ve, descansa. Si surje algo, te avisamos ;)
                </Typography>
              </Grid>
            ) : (
              <Grid direction='column' style={{ width: '100%' }}>
                <ToDoItem
                  icon={<FiDownload className={classes.icon} />}
                  title='Descargar Documentos'
                  body='Descarga los documentos que tu carrera solicita adjuntar.'
                  buttonText='Descargar'
                  buttonOnClick={() => setOpenDocs(true)}
                />
                <Divider />
                {userData.step === 1 &&
                  !(
                    internship && internship.status === changeDetailsApplication
                  ) && (
                    <>
                      <ToDoItem
                        icon={<FaWpforms className={classes.icon} />}
                        title='Completar Formulario de Inscripción de Práctica'
                        body='Rellena este formulario con la información de la empresa en la que quieres realizar tu práctica.'
                        buttonText={
                          internship && internship.status === sentApplication
                            ? 'En revisión'
                            : 'Completar'
                        }
                        reason={reason}
                        internship={internship}
                        buttonOnClick={() => history.push('/send-form')}
                        disabled={
                          internship && internship.status === sentApplication
                        }
                      />

                      <Divider />
                    </>
                  )}
                {internship && internship.status === changeDetailsApplication && (
                  <>
                    <ToDoItem
                      icon={<FaWpforms className={classes.icon} />}
                      title='Corregir Formulario'
                      buttonText='Corregir'
                      minorChanges={reason}
                      buttonOnClick={() =>
                        history.push(
                          `/edit-form/${userData.currentInternship.lastApplication}`
                        )
                      }
                    />
                    <Divider />
                  </>
                )}
                {userData.step === 2 && (
                  <>
                    <ToDoItem
                      icon={<FiDownload className={classes.icon} />}
                      title='Seguro de práctica'
                      body='Para comenzar tu práctica necesitas descargar el seguro.'
                      buttonText={
                        practicalinsurance.seguroDisponible === false ||
                        practicalinsurance.seguroDisponible === undefined
                          ? 'En proceso'
                          : 'Descargar'
                      }
                      buttonOnClick={() => setOpenSecure(true)}
                      disabled={
                        practicalinsurance.seguroDisponible === false ||
                        practicalinsurance.seguroDisponible === undefined
                      }
                    />
                    <Divider />
                  </>
                )}
                {userData.step === 2 &&
                  internship &&
                  internship.status !== reportNeedsChanges && (
                    <>
                      <ToDoItem
                        icon={
                          <IoDocumentAttachOutline className={classes.icon} />
                        }
                        title='Enviar Informe'
                        body='Al finalizar tu periodo de práctica, cuéntanos lo que has aprendido.'
                        buttonText='Enviar'
                        buttonOnClick={() =>
                          history.push('/evaluation-report/')
                        }
                        disabled={
                          internship && internship.status === sentReport
                        }
                      />
                      <Divider />
                    </>
                  )}
                {internship && internship.status === reportNeedsChanges && (
                  <>
                    <ToDoItem
                      icon={
                        <IoDocumentAttachOutline className={classes.icon} />
                      }
                      title='Corregir Informe'
                      body='El informe que has enviado requiere correcciones.'
                      buttonText='Corregir'
                      buttonOnClick={() => history.push('/evaluation-report/')}
                    />
                    <Typography color='error'>
                      Cambios necesarios: {internship.reason}
                    </Typography>
                    <Divider />
                  </>
                )}
                {userData.step === 2 && (
                  <>
                    <ToDoItem
                      icon={<AlarmAdd className={classes.icon} />}
                      title='Solicitar extensión'
                      body='Se enviara una solicitud para extender la fechad e termino de su practica'
                      buttonText='Solicitar'
                      reasonExtension={reasonExtension}
                      statusExtension={statusExtension}
                      disabled={
                        internship &&
                        internship.exceptionStatus === sentExtension
                      }
                      buttonOnClick={() => setShowExtension(true)}
                    />
                    <Divider />
                  </>
                )}
                {userData.step === 3 && (
                  <ToDoItem
                    icon={<RiSurveyLine className={classes.icon} />}
                    title='Responder Encuesta'
                    body='Cuéntanos tu experiencia durante las semanas de práctica.'
                    buttonText='Responder'
                      buttonOnClick={(e) => {
                    e.preventDefault();
                    window.location.href = survey.satisfactionSurvey;
                  }}
                  />
                )}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
        <DocsDialog open={openDocs} setOpen={setOpenDocs} />
        <DocsDialogSeguro open={openSecure} setOpen={setOpenSecure} />
        <Dialog
          open={showExtension}
          onClose={() => setShowExtension(false)}
          TransitionComponent={Transition}
          maxWidth='sm'
          fullWidth={true}>
          <DialogTitle>Solicitud de extensión</DialogTitle>

          <DialogContent>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <TextField
                  multiline
                  rowsMax={4}
                  fullWidth
                  variant='outlined'
                  label={'Razon de la solicitud'}
                  value={reasonRequestExtension}
                  onChange={(e) => setReasonRequestExtension(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction='column'
                  justify='center'
                  alignItems='flex-start'>
                  <Grid item>
                    <DatePicker
                      fullWidth
                      disableToolbar
                      variant='inline'
                      format='dd/MM/yyyy'
                      label={'Nueva fecha de termino'}
                      value={
                        dateExtension === ''
                          ? new Date()
                          : dateExtension instanceof Date
                          ? dateExtension
                          : dateExtension.toDate()
                      }
                      onChange={(date) => setDateExtension(date)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setShowExtension(false)}>
              Cerrar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                handleSendExtension();
                setShowExtension(false);
              }}>
              Solicitar
            </Button>
          </DialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>
    </>
  );
}
function DocsDialogSeguro({ open, setOpen }) {
  const { user, userData } = useAuth();

  function handleCloseDocsDialog() {
    setOpen(false);
  }

  return (
    <Dialog fullWidth onClose={handleCloseDocsDialog} open={open}>
      <DialogTitle>Seguro para práctica</DialogTitle>
      <DialogContent>
        <SeguroPracticaFileList
          studentId={user.uid}
          internshipId={userData.currentInternship.id}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDocsDialog} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DocsDialog({ open, setOpen }) {
  const { user, userData } = useAuth();

  function handleCloseDocsDialog() {
    setOpen(false);
  }

  return (
    <Dialog fullWidth onClose={handleCloseDocsDialog} open={open}>
      <DialogTitle>Descargar documentos</DialogTitle>
      <DialogContent>
        <InternshipIntentionFileList
          studentId={user.uid}
          internshipId={userData.currentInternship.id}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDocsDialog} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ToDoList;
