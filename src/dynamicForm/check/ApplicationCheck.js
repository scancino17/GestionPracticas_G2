import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import {
  AssignmentLate,
  Check,
  Clear,
  Edit,
  Save,
  CancelOutlined,
  MenuOutlined
} from '@material-ui/icons';
import FormView from '../builder_preview/FormView';
import { useNavigate } from 'react-router-dom';
import { useSupervisor } from '../../providers/Supervisor';

import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
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
const useStyles = makeStyles((theme) => ({
  root: {
    // Este flex: auto está aqui para que los form abajo puedan ocupar todo el tamaño del grid que los contiene
    // El '& .MuiTextField-root' tiene básicamente la misma funcionalidad.
    flex: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    '& .MuiFabroot': {
      width: '80px'
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  speedDial: {
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

function ApplicationCheck() {
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
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    Swal.fire({
      title: '¿Desea aplicar los cambios?',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        save();
        Swal.fire('¡Cambios Guardados!', '', 'success');
        setEdit(false);
      }
    });
  };

  const handleCancel = () => {
    BackUp();
    handleEdit();
  };

  const handleShowMinorChanges = () => {
    setShowMinorChanges(true);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleEdit = () => {
    setEdit(!edit);
    handleClose();
  };
  const handleShowApproved = () => {
    setShowApproved(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const actions = [
    {
      edit: false,
      icon: <Check />,
      name: 'Aprobar',
      function: handleShowApproved
    },
    {
      edit: false,
      icon: <Clear />,
      color: '#ff0000',
      name: 'Rechazar',
      function: handleShow
    },
    {
      edit: false,
      icon: <AssignmentLate />,
      name: 'Cambios menores',
      function: handleShowMinorChanges
    },
    { edit: false, icon: <Edit />, name: 'Editar', function: handleEdit },

    {
      edit: true,
      icon: <CancelOutlined />,
      name: 'Cancelar',
      function: handleCancel
    },
    { edit: true, icon: <Save />, name: 'Guardar', function: handleSave }
  ];

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

  function save() {
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
      <>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel='SpeedDial tooltip example'
          className={classes.speedDial}
          icon={edit ? <Edit /> : <MenuOutlined />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}>
          {actions.map((action, i) =>
            action.edit === edit ? (
              <SpeedDialAction
                tooltipOpen
                key={i}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.function}
              />
            ) : null
          )}
        </SpeedDial>
      </>

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
        <Container style={{ paddingBottom: '5rem' }}>
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
        <BootstrapDialog
          fullWidth
          onClose={() => setShow(false)}
          aria-labelledby='customized-dialog-title'
          open={show}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => setShow(false)}>
            Rechazar postulación de práctica
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              ¿Está seguro de rechazar postulación de Práctica?
            </Typography>

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
        </BootstrapDialog>
      )}
      {showApproved && (
        <BootstrapDialog
          fullWidth
          onClose={() => setShowApproved(false)}
          aria-labelledby='customized-dialog-title'
          open={showApproved}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => setShowApproved(false)}>
            Aprobar postulación de práctica
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              ¿Está seguro de aceptar la postulación de Práctica ?
            </Typography>
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
        </BootstrapDialog>
      )}
      {showMinorChanges && (
        <BootstrapDialog
          fullWidth
          onClose={() => setShowMinorChanges(false)}
          aria-labelledby='customized-dialog-title'
          open={showMinorChanges}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => setShowMinorChanges(false)}>
            Solicitud de cambios
          </BootstrapDialogTitle>
          <DialogContent dividers>
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
        </BootstrapDialog>
      )}
    </>
  );
}

export default ApplicationCheck;
