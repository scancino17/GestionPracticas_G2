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
  Typography
} from '@material-ui/core';
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

const pendingIntentionState = pendingIntention;
const approvedIntentionState = approvedIntention;
const deniedIntentionState = deniedIntention;

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

const IntentionList = ({ applications, update }) => {
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container>
      <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
        Estudiantes con intención de práctica
      </Typography>
      <Grid>
        {applications.map((application) => (
          <IntentionItem
            application={application}
            update={update}
            expanded={expanded}
            changeExpanded={changeExpanded}
          />
        ))}
      </Grid>
    </Container>
  );
};

const IntentionItem = ({ application, update, expanded, changeExpanded }) => {
  const classes = useStyles();
  const [showApprovalModal, setShowApprovalModal] = useState();
  const [showRejectModal, setShowRejectModal] = useState();

  const closeModal = () => {
    setShowApprovalModal(false);
    setShowRejectModal(false);
  };

  const { internshipId, name, applicationNumber } = application;
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
            }>{`Intención de práctica ${applicationNumber}`}</Typography>
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
              <Typography>Práctica {application.applicationNumber}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button color='primary' onClick={() => setShowRejectModal(true)}>
            Rechazar
          </Button>
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
  const { userData } = useAuth();

  function handleReject() {
    db.collection('internships')
      .doc(application.internshipId)
      .update({
        status: deniedIntentionState,
        reason: reason,
        evaluatingSupervisor: { name: userData.name, email: userData.email }
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
          {`¿Está seguro de rechazar Práctica ${application.applicationNumber} de ${application.name}?`}
        </DialogContentText>
        <TextField
          label='Razón de Rechazo'
          onChange={handleReasonChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={closeModal}>
          Cancelar
        </Button>
        <Button color='primary' onClick={handleReject}>
          Confirmar rechazo
        </Button>
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
  const { userData } = useAuth();
  const [letterFile, setLetterFile] = useState([]);
  const [isConfirmDisabled, setConfirmDisabled] = useState();

  function handleLetterFile(files) {
    setLetterFile(files);
  }

  useEffect(() => {
    console.log(letterFile);
    if (letterFile) {
      setConfirmDisabled(false);
    } else {
      setConfirmDisabled(true);
    }
  }, [letterFile]);

  function handleApprove() {
    const { studentId, internshipId } = application;

    db.collection('internships')
      .doc(internshipId)
      .update({
        status: approvedIntentionState,
        evaluatingSupervisor: { name: userData.name, email: userData.email }
      });

    letterFile.forEach((file) => {
      storage
        .ref()
        .child(
          `students-docs/${studentId}/${internshipId}/internship-intention/${file.name}`
        )
        .put(file);
    });

    db.collection('users')
      .doc(studentId)
      .update({
        currentInternship: {
          id: internshipId,
          number: application.applicationNumber
        }
      });

    closeModal();
    update();
  }

  return (
    <Dialog fullWidth open={showApprovalModal} onClose={closeModal}>
      <DialogTitle>Aprobar intención de práctica</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Aprobar intención de Práctica ${application.applicationNumber} de ${application.name}.`}</DialogContentText>
        <DialogContentText>
          Adjunte los archivos correspondientes.
        </DialogContentText>
        <DropzoneArea onChange={handleLetterFile} />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={closeModal}>
          Cancelar
        </Button>
        <Button
          color='primary'
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

    db.collection('internships')
      .where('status', '==', pendingIntentionState)
      .get()
      .then((snapshot) => {
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
