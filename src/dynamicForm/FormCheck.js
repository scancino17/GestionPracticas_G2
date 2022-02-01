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
import { AssignmentLate, Check, Clear, Edit, Save } from '@material-ui/icons';
import FormView from './builder_preview/FormView';
import { useNavigate } from 'react-router-dom';
import { useSupervisor } from '../providers/Supervisor';

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
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [showMinorChanges, setShowMinorChanges] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [edit, setEdit] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveReason, setApproveReason] = useState('');
  const classes = useStyles();
  const {
    getApplication,
    updateApplication,
    approveApplication,
    rejectApplication,
    amendApplication
  } = useSupervisor();

  useEffect(() => {
    let appData = getApplication(applicationId);
    setApplication(appData);
  }, [applicationId, getApplication]);

  function BackUp() {
    setApplication(getApplication(applicationId));
  }

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleApprove() {
    const applicationData = application;
    delete applicationData.form;

    approveApplication(applicationData, approveReason);
  }

  function handleReject() {
    setShow(false);
    rejectApplication(application, rejectReason);
  }

  function handleMinorChanges() {
    amendApplication(application, rejectReason, minorChanges);
  }

  function handleSave() {
    const values = {};
    application.form.forEach((step) =>
      step.form.forEach((camp) => {
        values[camp.name] = camp.value;
      })
    );

    updateApplication(applicationId, { form: application.form, ...values });
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
                navigate('/applications');
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
                navigate('/applications');
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
                navigate('/applications');
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
