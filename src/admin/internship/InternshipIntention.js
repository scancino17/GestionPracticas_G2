import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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

const approvalState = 'Pendiente Aprobación';
const confirmIntentionState = 'Pendiente';
const deniendState = 'Rechazado';

const useStyles = makeStyles((theme) => ({
  list: {
    padding: '1rem'
  },
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
  const classes = useStyles();
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid>
      <Typography variant='h3' style={{ paddingLeft: '1rem' }}>
        Estudiantes con intención de práctica
      </Typography>
      <Grid>
        <Grid className={classes.list}>
          {applications.map((application) => (
            <IntentionItem
              application={application}
              update={update}
              expanded={expanded}
              changeExpanded={changeExpanded}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const IntentionItem = ({ application, update, expanded, changeExpanded }) => {
  console.log(application);
  const classes = useStyles();
  const [showApprovalModal, setShowApprovalModal] = useState();
  const [showRejectModal, setShowRejectModal] = useState();

  const closeModal = () => {
    setShowApprovalModal(false);
    setShowRejectModal(false);
  };

  let { internshipId, name, applicationNumber } = application;
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
          <Button onClick={() => setShowRejectModal(true)}>Rechazar</Button>
          <Button onClick={() => setShowApprovalModal(true)}>Aprobar</Button>
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

  const handleRejecton = () => {
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: deniendState, reason: reason });

    closeModal();
    update();
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  return (
    <Dialog open={showRejectModal} onClose={closeModal}>
      <DialogTitle>Rechazar intención de práctica</DialogTitle>
      <DialogContent>
        <DialogContentText>{`¿Está seguro de rechazar Práctica ${application.applicationNumber} de ${application.name}?`}</DialogContentText>
        <DialogContentText>
          Esta operación no se podrá revertir.
        </DialogContentText>
        <TextField
          label='Razón de Rechazo'
          onChange={handleReasonChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button onClick={handleRejecton}>Confirmar rechazo</Button>
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
  const [letterFile, setLetterFile] = useState();
  const [isConfirmDisabled, setConfirmDisabled] = useState();

  const handleLetterFile = (files) => {
    setLetterFile(files[0]);
  };

  useEffect(() => {
    console.log(letterFile);
    if (letterFile) {
      setConfirmDisabled(false);
    } else {
      setConfirmDisabled(true);
    }
  }, [letterFile]);

  const handleApproval = () => {
    let { studentId, internshipId } = application;

    db.collection('internships')
      .doc(internshipId)
      .set({ status: confirmIntentionState }, { merge: true });

    storage
      .ref()
      .child(
        `students-docs/${studentId}/${internshipId}/letter/${letterFile.name}`
      )
      .put(letterFile);

    closeModal();
    update();
  };

  return (
    <Dialog open={showApprovalModal} onClose={closeModal}>
      <DialogTitle>Aprobar intención de práctica</DialogTitle>
      <DialogContent>
        <Typography>{`Aprobar intención de Práctica ${application.applicationNumber} de ${application.name}.`}</Typography>
        <Typography>
          Adjunte la carta de recomendación correspondiente.
        </Typography>
        <DropzoneArea onChange={handleLetterFile} />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button disabled={isConfirmDisabled} onClick={handleApproval}>
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
        let newState = [];
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
      .where('status', '==', approvalState)
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
