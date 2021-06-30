import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withStyles,
  DialogContentText
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { AssignmentLate, Check, Clear, Edit, Save } from '@material-ui/icons';
import FormView from './FormView';
import {
  approvedApplication,
  changeDetailsApplication,
  deniedApplication
} from '../InternshipStates';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { StudentNotificationTypes } from '../layout/NotificationMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    // Este flex: auto está aqui para que los form abajo puedan ocupar todo el tamaño del grid que los contiene
    // El '& .MuiTextField-root' tiene básicamente la misma funcionalidad.
    flex: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  topBottomPadding: {
    paddingTop: '1rem',
    paddingBottom: '1rem'
  },
  fabAccept: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  fabDecline: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(18)
  },
  fabMinorChanges: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(50)
  },
  fabEdit: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(35)
  },
  fabExitEdit: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(20)
  },
  fabSave: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const DenyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main
  }
}))(Button);

const SecondaryButton = withStyles((theme) => ({
  root: {
    color: grey[700]
  }
}))(Button);

function FormCheck() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState([]);
  const [minorChanges, setMinorChanges] = useState('');
  const [applicationUser, setApplicationUser] = useState([]);
  const history = useHistory();
  const [flag, setFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [showMinorChanges, setShowMinorChanges] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [edit, setEdit] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveReason, setApproveReason] = useState('');
  const classes = useStyles();

  useEffect(() => {
    db.collection('applications')
      .doc(applicationId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setApplication(data);
        db.collection('users')
          .doc(data.studentId)
          .get()
          .then((doc) => {
            setApplicationUser(doc.data());
          });
      });
  }, []);

  function BackUp() {
    db.collection('applications')
      .doc(applicationId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setApplication(data);
      });
  }

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleApprove() {
    const applicationData = application;
    delete applicationData.form;

    db.collection('applications')
      .doc(applicationId)
      .update({ status: 'Aprobado', reason: approveReason });

    db.collection('internships').doc(application.internshipId).update({
      status: approvedApplication,
      applicationData: applicationData,
      applicationId: applicationId,
      reason: approveReason
    });

    db.collection('users')
      .doc(application.studentId)
      .update({
        reason: approveReason,
        'currentInternship.lastApplication': applicationId,
        'currentInternship.Empresa': applicationData.Empresa,
        step: 2,
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.approvedApplication,
          time: firebase.firestore.FieldValue.serverTimestamp()
        }
      });

    db.collection('mails').add({
      to: applicationUser.email,
      template: {
        name: 'Approved',
        data: { from_name: applicationUser.name }
      }
    });
  }

  function handleReject() {
    setShow(false);
    db.collection('applications')
      .doc(applicationId)
      .update({ status: 'Rechazado', reason: rejectReason });
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: deniedApplication });

    db.collection('users')
      .doc(application.studentId)
      .update({
        'currentInternship.lastApplication': applicationId,
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.deniedApplication,
          time: firebase.firestore.FieldValue.serverTimestamp()
        }
      });

    db.collection('mails').add({
      to: applicationUser.email,
      template: {
        name: 'Failed',
        data: {
          from_name: applicationUser.name,
          result: rejectReason
        }
      }
    });
  }

  function handleMinorChanges() {
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: changeDetailsApplication });

    db.collection('applications')
      .doc(applicationId)
      .update({ status: 'Necesita cambios menores', reason: minorChanges });

    db.collection('users')
      .doc(application.studentId)
      .update({
        'currentInternship.lastApplication': applicationId,
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.changeDetailsApplication,
          time: firebase.firestore.FieldValue.serverTimestamp()
        }
      });

    db.collection('mails').add({
      to: applicationUser.email,
      template: {
        name: 'FailedMinorChanges',
        data: {
          from_name: applicationUser.name,
          result: rejectReason
        }
      }
    });
  }
  function handleSave() {
    const values = {};
    application.form.forEach((step) =>
      step.form.forEach((camp) => {
        values[camp.name] = camp.value;
      })
    );

    db.collection('applications')
      .doc(applicationId)
      .update({ form: application.form, ...values });
  }
  return (
    <>
      {!edit && (
        <>
          <Fab
            variant='extended'
            color='primary'
            className={classes.fabAccept}
            onClick={() => {
              setShowApproved(true);
            }}>
            <Check />
            Aprobar
          </Fab>
          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabDecline}
            onClick={() => setShow(true)}>
            <Clear />
            Rechazar
          </Fab>
          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabMinorChanges}
            onClick={() => setShowMinorChanges(true)}>
            <AssignmentLate />
            Cambios menores
          </Fab>
          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabEdit}
            onClick={() => {
              setEdit(!edit);
            }}>
            <Edit />
            Editar
          </Fab>
        </>
      )}
      {edit && (
        <>
          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabExitEdit}
            onClick={() => {
              BackUp();

              setEdit(!edit);
            }}>
            <Edit />
            Cancelar
          </Fab>
          <Fab
            variant='extended'
            color='primary'
            className={classes.fabSave}
            onClick={() => {
              Swal.fire({
                title: '¿Desea aplicar los cambios?',
                showCancelButton: true,
                confirmButtonText: `Aceptar`,
                cancelButtonText: `Cancelar`
              }).then((result) => {
                if (result.isConfirmed) {
                  handleSave();
                  Swal.fire('¡Cambios Guardados!', '', 'success');
                  setEdit(false);
                }
              });
            }}>
            <Save />
            Guardar
          </Fab>
        </>
      )}
      <Grid container direction='column'>
        <Grid
          style={{
            backgroundImage: "url('../AdminBanner-Form.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '2rem'
          }}>
          <Typography variant='h4'>Revisión Postulación</Typography>
        </Grid>
        <Container>
          {application.form &&
            application.form.map((step) => (
              <Grid item>
                <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
                  {step.step}
                </Typography>
                <FormView
                  readOnly={!edit}
                  studentId={application.studentId}
                  internshipId={application.internshipId}
                  applicationId={applicationId}
                  form={step.form}
                  flag={flag}
                  setFlag={setFlag}
                  admin
                />
              </Grid>
            ))}
        </Container>
      </Grid>
      {show && (
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Rechazar postulación de práctica</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro de rechazar postulación de Práctica?
            </DialogContentText>
            <TextField
              fullWidth
              label='Razón de rechazo'
              multiline
              variant='outlined'
              rows={4}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton color='primary' onClick={() => setShow(false)}>
              Cancelar
            </SecondaryButton>
            <DenyButton
              color='primary'
              onClick={() => {
                handleReject();
                history.push('/applications');
              }}>
              Confirmar rechazo
            </DenyButton>
          </DialogActions>
        </Dialog>
      )}
      {showApproved && (
        <Dialog
          open={showApproved}
          onClose={() => setShowApproved(false)}
          fullWidth>
          <DialogTitle>Aprobar postulación de práctica</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro de aceptar la postulación de Práctica ?
            </DialogContentText>
            <TextField
              fullWidth
              label='Comentarios'
              multiline
              variant='outlined'
              rows={4}
              onChange={(e) => setApproveReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton
              color='primary'
              onClick={() => setShowApproved(false)}>
              Cancelar
            </SecondaryButton>
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                handleApprove();
                setShowApproved(false);
                history.push('/applications');
              }}>
              Confirmar aprobación
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {showMinorChanges && (
        <Dialog
          open={showMinorChanges}
          onClose={() => setShowMinorChanges(false)}
          fullWidth>
          <DialogTitle>Solicitud de cambios</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label='Cambios necesarios'
              multiline
              variant='outlined'
              rows={4}
              onChange={(e) => setMinorChanges(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton
              color='primary'
              onClick={() => setShowMinorChanges(false)}>
              Cancelar
            </SecondaryButton>
            <DenyButton
              color='primary'
              onClick={() => {
                handleMinorChanges();
                setShowMinorChanges(false);
                history.push('/applications');
              }}>
              Confirmar solicitud
            </DenyButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default FormCheck;
