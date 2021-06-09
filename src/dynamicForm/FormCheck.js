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
import { Check, Clear, Save } from '@material-ui/icons';
import FormView from './FormView';
import {
  approvedApplication,
  changeDetailsApplication
} from '../InternshipStates';
import { useHistory } from 'react-router-dom';
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

  const [edit, setEdit] = useState(false);
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
    db.collection('applications')
      .doc(applicationId)
      .update({ status: 'Aprobado' });
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: approvedApplication });
    db.collection('users').doc(application.studentId).update({ step: 2 });

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
    //cambiar estado a la application
    db.collection('users')
      .doc(application.studentId)
      .update({ 'currentInternship.lastApplication': applicationId });
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

          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabMinorChanges}
            onClick={() => {
              handleMinorChanges();
            }}>
            <Clear />
            Cambios menores
          </Fab>
          <Fab
            variant='extended'
            color='secondary'
            className={classes.fabEdit}
            onClick={() => {
              setEdit(!edit);
            }}>
            <Clear />
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
            <Clear />
            Salir de la Edición
          </Fab>
          <Fab
            variant='extended'
            color='primary'
            className={classes.fabSave}
            onClick={() => {
              Swal.fire({
                title: '¿Desea Aplicar los cambios?',
                showDenyButton: true,
                confirmButtonText: `Aceptar`,
                denyButtonText: `Cancelar`
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
      {show && (
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Rechazar postulación de práctica</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`¿Está seguro de rechazar postulación de Práctica ?`}
            </DialogContentText>
            <TextField
              fullWidth
              label={'Razón de rechazo'}
              multiline
              rowsMax={4}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton color='primary' onClick={() => setShow(false)}>
              Cancelar
            </SecondaryButton>
            <DenyButton color='primary' onClick={handleReject}>
              Confirmar rechazo
            </DenyButton>
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
              label={'Cambios necesarios'}
              multiline
              rowsMax={4}
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
              onClick={(handleMinorChanges, setShowMinorChanges(false))}>
              Confirmar solicitud
            </DenyButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default FormCheck;
