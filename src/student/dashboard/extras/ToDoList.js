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
  Typography
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
import InternshipIntentionFileList, {
  SeguroPracticaFileList
} from './InternshipIntentionFileList';

import {
  changeDetailsApplication,
  reportNeedsChanges,
  sentApplication,
  deniedApplication,
  pendingApplication,
  sentReport
} from '../../../InternshipStates';

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
  internship,
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
            <Typography color='textSecondary' variant='body2'>
              {body}
            </Typography>

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
  useEffect(() => {
    const unsubscribe = db
      .collection('internships')
      .doc(userData.currentInternship.id)
      .onSnapshot((doc) => setInternship(doc.data()));
    console.log(internship);
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

  return (
    <>
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
                      buttonOnClick={() => history.push('/evaluation-report/')}
                      disabled={internship && internship.status === sentReport}
                    />
                    <Divider />
                  </>
                )}
              {internship && internship.status === reportNeedsChanges && (
                <>
                  <ToDoItem
                    icon={<IoDocumentAttachOutline className={classes.icon} />}
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
              {userData.step === 3 && (
                <ToDoItem
                  icon={<RiSurveyLine className={classes.icon} />}
                  title='Responder Encuesta'
                  body='Cuéntanos tu experiencia durante las semanas de práctica.'
                  buttonText='Responder'
                />
              )}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
      <DocsDialog open={openDocs} setOpen={setOpenDocs} />
      <DocsDialogSeguro open={openSecure} setOpen={setOpenSecure} />
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
