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
  DialogActions
} from '@material-ui/core';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Check, Clear } from '@material-ui/icons';
import FormView from './FormView';
import {
  approvedApplication,
  changeDetailsApplication
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
  }
}));

function FormCheck() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState([]);
  const [applicationUser, setApplicationUser] = useState([]);
  const history = useHistory();
  const [flag, setFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
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

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleApprove() {
    db.collection('applications')
      .doc(applicationId)
      .update({ status: 'Aprobado' });
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: approvedApplication });
    db.collection('users')
      .doc(application.studentId)
      .update({
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
        data: {
          from_name: applicationUser.name
        }
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
      .update({ status: changeDetailsApplication });

    db.collection('users')
      .doc(application.studentId)
      .update({
        step: 2,
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

  return (
    <>
      <Fab
        variant='extended'
        color='primary'
        className={classes.fabAccept}
        onClick={() => {
          Swal.fire({
            title: '¿Aprobar solicitud de práctica?',
            showDenyButton: true,
            confirmButtonText: `Aceptar`,
            denyButtonText: `Cancelar`
          }).then((result) => {
            if (result.isConfirmed) {
              handleApprove();
              Swal.fire('¡Solicitud aprobada!', '', 'success').then(
                (result) => {
                  if (result.isConfirmed) history.push('/applications');
                }
              );
            }
          });
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

      <Container>
        <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
          Revisión Postulación
        </Typography>
        {application.form &&
          application.form.map((step) => (
            <Grid item>
              <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
                {step.step}
              </Typography>
              <FormView
                readOnly
                studentId={application.studentId}
                internshipId={application.internshipId}
                applicationId={applicationId}
                form={step.form}
                flag={flag}
                setFlag={setFlag}
              />
            </Grid>
          ))}
      </Container>
      {show && (
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Razón de rechazo</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              variant='outlined'
              label={'Razón'}
              multiline
              rowsMax={4}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={handleReject}>
              Rechazar
            </Button>
            <Button color='primary' onClick={() => setShow(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default FormCheck;
