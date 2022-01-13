import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { ExpandMore } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useCallback, useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import {
  approvedIntention,
  deniedIntention,
  pendingIntention
} from '../../InternshipStates';
import { useAuth } from '../../providers/Auth';
import { StudentNotificationTypes } from '../../layout/NotificationMenu';
import { serverTimestamp } from 'firebase/firestore';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
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

function IntentionList({ applications, update }) {
  const [expanded, setExpanded] = useState();
  const itemsPerPage = 14;
  const [page, setPage] = useState(1);

  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Intention.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>
          Estudiantes con intención de práctica
        </Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        {applications
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((application) => (
            <IntentionItem
              application={application}
              update={update}
              expanded={expanded}
              changeExpanded={changeExpanded}
            />
          ))}
        <Grid container justifyContent='flex-end' style={{ marginTop: '2rem' }}>
          {applications && applications.length > 0 ? (
            <Pagination
              count={Math.ceil(applications.length / itemsPerPage)}
              page={page}
              color='primary'
              onChange={(_, val) => setPage(val)}
            />
          ) : (
            <Grid
              container
              direction='column'
              align='center'
              justifyContent='center'
              style={{ marginTop: '6rem' }}>
              <Grid item>
                <img src='inten.png' width='300' />
              </Grid>
              <Typography variant='h5' color='textSecondary'>
                No hay intenciones de práctica disponibles
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

const IntentionItem = ({ application, update, expanded, changeExpanded }) => {
  const classes = useStyles();
  const [showApprovalModal, setShowApprovalModal] = useState();
  const [showRejectModal, setShowRejectModal] = useState();

  const closeModal = () => {
    setShowApprovalModal(false);
    setShowRejectModal(false);
  };

  const { internshipId, name, internshipNumber } = application;
  return (
    <>
      <Accordion
        expanded={expanded === internshipId}
        onChange={changeExpanded(internshipId)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>{name}</Typography>
          <Typography
            className={
              classes.secondaryHeading
            }>{`Intención de práctica ${internshipNumber}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
              <Typography variant='h6'>Detalles de postulante</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <Box fontWeight='fontWeightMedium'>Nombre:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{application.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <Box fontWeight='fontWeightMedium'>Rut:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{application.rut}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <Box fontWeight='fontWeightMedium'>Matrícula:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{application.enrollmentNumber}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <Box fontWeight='fontWeightMedium'>Correo:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{application.email}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '.5rem' }}>
              <Typography>Práctica {application.internshipNumber}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <DenyButton color='primary' onClick={() => setShowRejectModal(true)}>
            Rechazar
          </DenyButton>
          <Button color='primary' onClick={() => setShowApprovalModal(true)}>
            Aprobar
          </Button>
        </AccordionActions>
      </Accordion>
      <ApprovalModal
        application={application}
        closeModal={closeModal}
        update={update}
        showApprovalModal={showApprovalModal}
      />
      <RejectModal
        application={application}
        closeModal={closeModal}
        update={update}
        showRejectModal={showRejectModal}
      />
    </>
  );
};

const RejectModal = ({ application, closeModal, update, showRejectModal }) => {
  const [reason, setReason] = useState('');
  const { user } = useAuth();

  function handleReject() {
    db.collection('internships')
      .doc(application.internshipId)
      .update({
        status: deniedIntention,
        reason: reason,
        evaluatingSupervisor: { name: user.displayName, email: user.email }
      });

    db.collection('users')
      .doc(application.studentId)
      .update({
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.deniedIntention,
          time: serverTimestamp()
        }
      });

    db.collection('mails').add({
      to: application.email,
      template: {
        name: 'FailedIntention',
        data: {
          from_name: application.name,
          result: reason,
          rechazado_por: user.displayName,
          rechazado_por_email: user.email
        }
      }
    });

    closeModal();
    update();
  }

  function handleReasonChange(e) {
    setReason(e.target.value);
  }

  return (
    <Dialog fullWidth open={showRejectModal} onClose={closeModal}>
      <DialogTitle>Rechazar intención de práctica</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`¿Está seguro de rechazar Práctica ${application.internshipNumber} de ${application.name}?`}
        </DialogContentText>
        <TextField
          multiline
          rows={4}
          label='Razón de Rechazo'
          variant='outlined'
          onChange={handleReasonChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
        <DenyButton onClick={handleReject}>Confirmar rechazo</DenyButton>
      </DialogActions>
    </Dialog>
  );
};

const ApprovalModal = ({
  application,
  closeModal,
  update,
  showApprovalModal
}) => {
  const { user } = useAuth();
  const [letterFile, setLetterFile] = useState([]);
  const [isConfirmDisabled, setConfirmDisabled] = useState();
  const [reason, setReason] = useState('');

  function handleLetterFile(files) {
    setLetterFile(files);
  }

  useEffect(() => {
    if (letterFile) setConfirmDisabled(false);
    else setConfirmDisabled(true);
  }, [letterFile]);

  function handleApprove() {
    const { studentId, internshipId } = application;

    db.collection('internships')
      .doc(internshipId)
      .update({
        status: approvedIntention,
        reason: reason,
        evaluatingSupervisor: { name: user.displayName, email: user.email },
        seguroDisponible: false,
        alreadyDownloaded: false
      });

    letterFile.forEach((file) => {
      storage
        .ref()
        .child(
          `students-docs/${studentId}/${internshipId}/internship-intention/${file.name}`
        )
        .put(file);
    });

    db.collection('mails').add({
      to: application.email,
      template: {
        name: 'approvedIntention',
        data: {
          from_name: application.name,
          aprobado_por: user.displayName,
          razon_aprobacion: reason ? reason : 'Sin observaciones'
        }
      }
    });

    db.collection('users')
      .doc(studentId)
      .update({
        currentInternship: {
          id: internshipId,
          number: application.internshipNumber
        },
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.approvedIntention,
          time: serverTimestamp()
        }
      });

    closeModal();
    update();
  }

  function handleReasonChange(e) {
    setReason(e.target.value);
  }

  return (
    <Dialog fullWidth open={showApprovalModal} onClose={closeModal}>
      <DialogTitle>Aprobar intención de práctica</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Aprobar intención de Práctica ${application.internshipNumber} de ${application.name}.`}</DialogContentText>
        <DialogContentText>
          Adjunte los archivos correspondientes.
        </DialogContentText>
        <DropzoneArea
          showFileNames
          acceptedFiles={['application/pdf']}
          onChange={handleLetterFile}
        />
        <DialogContentText />
        <DialogContentText>
          Puede añadir observaciones pertinentes en el siguiente campo:
        </DialogContentText>
        <TextField
          multiline
          rows={4}
          label='Observaciones'
          onChange={handleReasonChange}
          variant='outlined'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
        <Button
          color='primary'
          variant='contained'
          disabled={isConfirmDisabled}
          onClick={handleApprove}>
          Confirmar Aprobación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function InternshipIntention() {
  const [applications, setApplications] = useState([]);
  const { user } = useAuth();

  const addApplication = useCallback(
    (newItem) => {
      setApplications((prevState) => {
        const newState = [];
        prevState.forEach((item) => newState.push(item));
        newState.push(newItem);
        return newState;
      });
    },
    [setApplications]
  );

  const updateApplications = useCallback(() => {
    setApplications([]);

    const dbRef = user.careerId
      ? db
          .collection('internships')
          .where('careerId', '==', user.careerId)
          .where('status', '==', pendingIntention)
      : db.collection('internships').where('status', '==', pendingIntention);
    dbRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const internship = doc.data();
        const internshipId = doc.id;

        db.collection('users')
          .doc(internship.studentId)
          .get()
          .then((student) => {
            addApplication({
              internshipId: internshipId,
              ...internship,
              ...student.data()
            });
          });
      });
    });
  }, [setApplications, addApplication]);

  useEffect(() => {
    updateApplications();
  }, [updateApplications]);

  return (
    <IntentionList applications={applications} update={updateApplications} />
  );
}

export default InternshipIntention;
