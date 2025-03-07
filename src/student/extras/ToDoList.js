import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  Hidden,
  TextField,
  Typography,
  Slide
} from '@material-ui/core';
import React, { useState } from 'react';
import { FaChevronDown, FaWpforms } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { RiSurveyLine } from 'react-icons/ri';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { makeStyles } from '@material-ui/core/styles';
import { useUser } from '../../providers/User';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../firebase';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InternshipIntentionFileList, {
  SeguroPracticaFileList
} from './InternshipIntentionFileList';
import DateFnsUtils from '@date-io/date-fns';
import {
  changeDetailsApplication,
  reportNeedsChanges,
  sentApplication,
  pendingApplication,
  sentReport,
  sentExtension,
  deniedExtension,
  approvedExtension
} from '../../InternshipStates';
import { AlarmAdd, ErrorOutline } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import draftToHtml from 'draftjs-to-html';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { serverTimestamp } from 'firebase/firestore';
import { useStudent } from '../../providers/Student';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

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
      justifyContent='space-between'
      wrap='nowrap'>
      <Grid container>
        <Hidden smDown>
          <Grid item>{icon}</Grid>
        </Hidden>
        <Grid item>
          <Typography variant='h6'>{title}</Typography>
          <Hidden smDown>
            <Typography color='textSecondary' variant='body2'>
              {body}
            </Typography>
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
            {statusExtension === approvedExtension && (
              <>
                <Typography style={{ color: '#4caf50' }} variant='body2'>
                  Aprobado
                </Typography>
                <Typography variant='body2'>
                  {`Observación: ${
                    reasonExtension ? reasonExtension : 'Sin observaciones'
                  }`}
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

function ToDoList() {
  // Esto existe si por algun motivo en algíun momento la lista de tareas
  // debe estar vacía. Actualmente, en ningún momento del proceso se llega a
  // este estado.
  // eslint-disable-next-line no-unused-vars
  const [done, setDone] = useState(false);

  const { step, currentInternship, lastApplication, currentInternshipData } =
    useStudent();
  const classes = useStyles();
  const [openDocs, setOpenDocs] = useState(false);
  const navigate = useNavigate();
  const [openSecure, setOpenSecure] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [openSendReport, setOpenSendReport] = useState(false);
  const [openReportAnnotations, setOpenReportAnnotations] = useState(false);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<FaChevronDown />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <Typography variant='h5'>Lista de Pendientes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {done ? (
            <Grid container direction='column' alignItems='center'>
              <img src='/AllDone.png' alt='Sin tareas' />
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
              {step === 1 &&
                !(
                  currentInternshipData &&
                  currentInternshipData.status === changeDetailsApplication
                ) && (
                  <>
                    <ToDoItem
                      icon={<FaWpforms className={classes.icon} />}
                      title='Completar Formulario de Inscripción de Práctica'
                      body='Rellena este formulario con la información de la empresa en la que quieres realizar tu práctica.'
                      buttonText={
                        currentInternshipData &&
                        currentInternshipData.status === sentApplication
                          ? 'En revisión'
                          : 'Completar'
                      }
                      internship={currentInternshipData}
                      buttonOnClick={() => navigate('/send-application')}
                      disabled={
                        currentInternshipData &&
                        currentInternshipData.status === sentApplication
                      }
                    />
                  </>
                )}
              {currentInternshipData &&
                currentInternshipData.status === changeDetailsApplication && (
                  <>
                    <ToDoItem
                      icon={<FaWpforms className={classes.icon} />}
                      title='Corregir Formulario'
                      buttonText='Corregir'
                      minorChanges={lastApplication.reason}
                      buttonOnClick={() =>
                        navigate(
                          `/edit-form/${currentInternship.lastApplication}`
                        )
                      }
                    />
                    <Divider />
                  </>
                )}
              {step === 2 && (
                <>
                  <ToDoItem
                    icon={<FiDownload className={classes.icon} />}
                    title='Seguro de práctica'
                    body='Para comenzar tu práctica necesitas descargar el seguro.'
                    buttonText={
                      currentInternshipData &&
                      !currentInternshipData.seguroDisponible
                        ? 'En proceso'
                        : 'Descargar'
                    }
                    buttonOnClick={() => setOpenSecure(true)}
                    disabled={
                      currentInternshipData &&
                      !currentInternshipData.seguroDisponible
                    }
                  />
                  <Divider />
                </>
              )}

              {step === 2 && currentInternshipData && (
                <>
                  <ToDoItem
                    icon={<RiSurveyLine className={classes.icon} />}
                    title='Responder encuesta de satisfacción'
                    body='Al finalizar tu periodo de práctica, dinos como fue tu experiencia.'
                    buttonText='Responder'
                    buttonOnClick={() => navigate('/send-survey')}
                    disabled={
                      currentInternshipData && currentInternshipData.survey
                    }
                  />
                  <Divider />
                </>
              )}
              {step === 2 &&
                currentInternshipData &&
                currentInternshipData.status !== reportNeedsChanges && (
                  <>
                    <ToDoItem
                      icon={
                        <IoDocumentAttachOutline className={classes.icon} />
                      }
                      title='Enviar Informe'
                      body='Luego de responder la encuesta de satisfacción, cuéntanos lo que has aprendido en tu informe de práctica.'
                      buttonText='Enviar'
                      buttonOnClick={() => setOpenSendReport(true)}
                      disabled={
                        (currentInternshipData &&
                          currentInternshipData.status === sentReport) ||
                        (currentInternshipData && !currentInternshipData.survey)
                      }
                    />
                    <Divider />
                  </>
                )}
              {currentInternshipData &&
                currentInternshipData.status === reportNeedsChanges && (
                  <>
                    <ToDoItem
                      icon={<ErrorOutline className={classes.icon} />}
                      title='Observaciones'
                      body='Se te han indicado unas correcciones que puedes hacer a tu informe.'
                      buttonText='Ver observaciones'
                      buttonOnClick={() => setOpenReportAnnotations(true)}
                    />
                    <Divider />
                  </>
                )}
              {currentInternshipData &&
                currentInternshipData.status === reportNeedsChanges && (
                  <>
                    <ToDoItem
                      icon={
                        <IoDocumentAttachOutline className={classes.icon} />
                      }
                      title='Resubir Informe'
                      body='El informe que has enviado requiere correcciones, vuelve a subirlo cuando lo hayas modificado.'
                      buttonText='Corregir'
                      buttonOnClick={() => setOpenSendReport(true)}
                    />
                    <Divider />
                  </>
                )}
              {step === 2 && currentInternshipData && (
                <>
                  <ToDoItem
                    icon={<AlarmAdd className={classes.icon} />}
                    title='Solicitar extensión'
                    body='Se enviará una solicitud para extender la fecha de término de su práctica'
                    buttonText='Solicitar'
                    reasonExtension={currentInternshipData.reasonExtension}
                    statusExtension={currentInternshipData.extensionStatus}
                    disabled={
                      currentInternshipData &&
                      currentInternshipData.extensionStatus === sentExtension
                    }
                    buttonOnClick={() => setShowExtension(true)}
                  />
                </>
              )}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
      <SendReportDialog open={openSendReport} setOpen={setOpenSendReport} />
      <DocsDialog open={openDocs} setOpen={setOpenDocs} />
      <DocsDialogSeguro open={openSecure} setOpen={setOpenSecure} />
      <DialogExtension
        internship={currentInternshipData}
        open={showExtension}
        setOpen={setShowExtension}
      />
      <ReportAnnotationsDialog
        open={openReportAnnotations}
        setOpen={setOpenReportAnnotations}
        internship={currentInternshipData}
      />
    </MuiPickersUtilsProvider>
  );
}

function DialogExtension({ internship, open, setOpen }) {
  const [dateExtension, setDateExtension] = useState(new Date());
  const [reasonRequestExtension, setReasonRequestExtension] = useState('');
  const { updateCurrentInternship } = useStudent();

  function handleSendExtension() {
    updateCurrentInternship({
      extensionStatus: sentExtension,
      dateExtension: dateExtension,
      reasonExtension: reasonRequestExtension,
      sentExtensionTime: serverTimestamp()
    });
  }

  function transformDate(date) {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];

    return (
      date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()
    );
  }

  return (
    <BootstrapDialog
      fullWidth
      onClose={() => setOpen(false)}
      aria-labelledby='customized-dialog-title'
      open={open}
      TransitionComponent={Transition}
      maxWidth='sm'>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={() => setOpen(false)}>
        Solicitud de extensión
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant='outlined'
              label='Razón de la solicitud'
              value={reasonRequestExtension}
              onChange={(e) => setReasonRequestExtension(e.target.value)}
            />
          </Grid>
          <Grid item>
            <DatePicker
              fullWidth
              disabled
              disableToolbar
              variant='inline'
              format='dd/MM/yyyy'
              label='Fecha de término actual'
              value={
                internship &&
                internship.applicationData &&
                internship.applicationData['Fecha de término']
                  ? transformDate(
                      internship.applicationData['Fecha de término'].toDate()
                    )
                  : null
              }
              onChange={(date) => setDateExtension(date)}
            />
          </Grid>
          <Grid item>
            <DatePicker
              fullWidth
              disableToolbar
              variant='inline'
              format='dd/MM/yyyy'
              label='Nueva fecha de término'
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
      </DialogContent>
      <DialogActions>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setOpen(false)}>
          Cerrar
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            handleSendExtension();
            setOpen(false);
          }}>
          Solicitar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function SendReportDialog({ open, setOpen }) {
  const [files, setFiles] = useState([]);
  const { userId } = useUser();
  const { updateCurrentInternship, currentInternship } = useStudent();

  function handleSend() {
    files.forEach((file) => {
      storage
        .ref()
        .child(
          `/students-docs/${userId}/${currentInternship.id}/reports/${currentInternship.id}.pdf`
        )
        .put(file);
    });

    updateCurrentInternship({
      status: sentReport,
      sentReportDate: serverTimestamp()
    });
  }

  return (
    <BootstrapDialog
      fullWidth
      onClose={() => setOpen(false)}
      aria-labelledby='customized-dialog-title'
      open={open}>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={() => setOpen(false)}>
        Enviar informe de práctica
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Grid item xs={12}>
          <DropzoneArea
            showFileNames
            filesLimit={1}
            acceptedFiles={['application/pdf']}
            onChange={(file) => setFiles(file)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={() => setOpen(false)}>
          cancelar
        </Button>
        <Button
          variant='contained'
          disabled={files.length === 0 ? true : false}
          color='primary'
          onClick={() => {
            handleSend();
            setOpen(false);
          }}>
          enviar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function ReportAnnotationsDialog({ open, setOpen, internship }) {
  return (
    <BootstrapDialog
      fullWidth
      onClose={() => setOpen(false)}
      aria-labelledby='customized-dialog-title'
      open={open}>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={() => setOpen(false)}>
        Observaciones de tu informe
      </BootstrapDialogTitle>
      <DialogContent dividers>
        {internship && internship.reportAnnotations && (
          <div
            dangerouslySetInnerHTML={{
              __html: draftToHtml(
                convertToRaw(
                  EditorState.createWithContent(
                    convertFromRaw(internship.reportAnnotations)
                  ).getCurrentContent()
                )
              )
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpen(false)}>
          Aceptar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function DocsDialogSeguro({ open, setOpen }) {
  const { userId } = useUser();
  const { currentInternship } = useStudent();

  function handleCloseDocsDialog() {
    setOpen(false);
  }

  return (
    <BootstrapDialog
      fullWidth
      onClose={handleCloseDocsDialog}
      aria-labelledby='customized-dialog-title'
      open={open}>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={handleCloseDocsDialog}>
        Seguro para práctica
      </BootstrapDialogTitle>
      <DialogContent dividers>
        {currentInternship && (
          <SeguroPracticaFileList
            studentId={userId}
            internshipId={currentInternship.id}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDocsDialog} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function DocsDialog({ open, setOpen }) {
  const { userId } = useUser();
  const { currentInternship } = useStudent();

  function handleCloseDocsDialog() {
    setOpen(false);
  }

  return (
    <BootstrapDialog
      fullWidth
      onClose={handleCloseDocsDialog}
      aria-labelledby='customized-dialog-title'
      open={open}>
      <BootstrapDialogTitle
        id='customized-dialog-title'
        onClose={handleCloseDocsDialog}>
        Descargar documentos
      </BootstrapDialogTitle>
      <DialogContent dividers>
        {currentInternship && (
          <InternshipIntentionFileList
            studentId={userId}
            internshipId={currentInternship.id}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDocsDialog} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

export default ToDoList;
