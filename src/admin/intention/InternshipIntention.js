import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
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
  withStyles,
  Box
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { ExpandMore } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { pendingIntention } from '../../InternshipStates';
import { useSupervisor } from '../../providers/Supervisor';
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
  },
  bold: {
    fontWeight: 600
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

function IntentionList({ pendingIntentions, update }) {
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
        {pendingIntentions
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((internship, index) => (
            //por el momento queda el indice como key
            <IntentionItem
              key={internship.internshipId}
              internship={internship}
              update={update}
              expanded={expanded}
              changeExpanded={changeExpanded}
            />
          ))}
        <Grid container justifyContent='flex-end' style={{ marginTop: '2rem' }}>
          {pendingIntentions && pendingIntentions.length > 0 ? (
            <Pagination
              style={{ marginBottom: '40px' }}
              count={Math.ceil(pendingIntentions.length / itemsPerPage)}
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
                <img
                  src='inten.png'
                  width='300'
                  alt='Sin intenciones de práctica'
                />
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

const IntentionItem = ({ internship, update, expanded, changeExpanded }) => {
  const classes = useStyles();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const closeModal = () => {
    setShowApprovalModal(false);
    setShowRejectModal(false);
  };

  const { internshipId, name, internshipNumber } = internship;
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
              <Typography className={classes.bold}>Nombre:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{internship.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Rut:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{internship.rut}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Matrícula:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{internship.enrollmentNumber}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Correo:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography>{internship.email}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <Box fontWeight='fontWeightMedium'>Carrera:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{internship.careerName}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '.5rem' }}>
              <Typography>Práctica {internship.internshipNumber}</Typography>
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
        internship={internship}
        closeModal={closeModal}
        update={update}
        showApprovalModal={showApprovalModal}
      />
      <RejectModal
        internship={internship}
        closeModal={closeModal}
        update={update}
        showRejectModal={showRejectModal}
      />
    </>
  );
};

const RejectModal = ({ internship, closeModal, update, showRejectModal }) => {
  const [reason, setReason] = useState('');
  const { rejectInternshipIntention } = useSupervisor();

  function handleReject() {
    rejectInternshipIntention(internship, reason);
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
          {`¿Está seguro de rechazar Práctica ${internship.internshipNumber} de ${internship.name}?`}
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
  internship,
  closeModal,
  update,
  showApprovalModal
}) => {
  const [letterFile, setLetterFile] = useState([]);
  const [isConfirmDisabled, setConfirmDisabled] = useState();
  const [reason, setReason] = useState('');
  const { approveInternshipIntention } = useSupervisor();

  function handleLetterFile(files) {
    setLetterFile(files);
  }

  useEffect(() => {
    if (letterFile) setConfirmDisabled(false);
    else setConfirmDisabled(true);
  }, [letterFile]);

  function handleApprove() {
    approveInternshipIntention(internship, reason, letterFile);
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
        <DialogContentText>{`Aprobar intención de Práctica ${internship.internshipNumber} de ${internship.name}.`}</DialogContentText>
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
  const [pendingIntentions, setPendingIntentions] = useState([]);
  const { students, internships } = useSupervisor();

  const addIntention = useCallback(
    (newItem) => {
      setPendingIntentions((prevState) => {
        const newState = [];
        prevState.forEach((item) => newState.push(item));
        newState.push(newItem);
        return newState;
      });
    },
    [setPendingIntentions]
  );

  const pendingIntentionList = useMemo(() => {
    return internships.filter(
      (internship) => internship.status === pendingIntention
    );
  }, [internships]);

  const updateIntentions = useCallback(() => {
    setPendingIntentions([]);

    if (pendingIntentionList && students && !!students.length) {
      pendingIntentionList.forEach((internship) => {
        const internshipId = internship.id;
        const studentData = students.find(
          (student) => student.id === internship.studentId
        );
        addIntention({
          internshipId: internshipId,
          ...studentData,
          ...internship
        });
      });
    }
  }, [addIntention, pendingIntentionList, students]);

  useEffect(() => {
    updateIntentions();
  }, [updateIntentions]);

  return (
    <IntentionList
      pendingIntentions={pendingIntentions}
      update={updateIntentions}
    />
  );
}

export default InternshipIntention;
