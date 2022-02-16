import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Container,
  DialogContentText,
  Grid,
  makeStyles,
  TextField,
  Typography,
  withStyles,
  Box,
  Button
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { ExpandMore } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { pendingIntention } from '../../InternshipStates';
import { useSupervisor } from '../../providers/Supervisor';
import { Pagination } from '@material-ui/lab';

import PropTypes from 'prop-types';
import GetAppIcon from '@material-ui/icons/GetApp';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CareerSelector from '../../utils/CareerSelector';
import { DEFAULT_CAREER } from '../../providers/User';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';

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
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const itemsPerPage = 14;
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const { careers } = useSupervisor();
  const changeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredInternshipIntention = useMemo(() => {
    if (pendingIntentions) {
      let filtered = pendingIntentions.slice();
      if (selectedCareerId !== 'general')
        filtered = filtered.filter(
          (item) => item.careerId === selectedCareerId
        );
      if (name !== '')
        filtered = filtered.filter((item) => item.studentName.includes(name));
      return filtered;
    } else return [];
  }, [pendingIntentions, name, selectedCareerId]);
  function ExportarExcel() {
    return (
      <ExcelFile
        element={
          <Button
            fullWidth
            color='primary'
            variant='contained'
            startIcon={<GetAppIcon />}>
            Exportar datos
          </Button>
        }
        filename='Estudiantes con intención de práctica'>
        <ExcelSheet
          data={filteredInternshipIntention}
          name='Estudiantes para seguro'>
          <ExcelColumn label='Nombre estudiante' value='name' />
          <ExcelColumn label='N° de Matrícula' value='enrollmentNumber' />
          <ExcelColumn label='RUT estudiante' value='rut' />
          <ExcelColumn label='Carrera' value='careerName' />
          <ExcelColumn label='Tipo de práctica' value='internshipNumber' />
          <ExcelColumn label='Correo' value='email' />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <Grid
        item
        style={{
          backgroundImage: "url('AdminBanner-Intention.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography component={'span'} variant='h4'>
          Estudiantes con intención de práctica
        </Typography>
      </Grid>
      <Container style={{ marginTop: '2rem' }}>
        <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CareerSelector
              careerId={selectedCareerId}
              setCareerId={setSelectedCareerId}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <ExportarExcel />
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filteredInternshipIntention
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
          {filteredInternshipIntention &&
          filteredInternshipIntention.length > 0 ? (
            <Pagination
              style={{ marginBottom: '40px' }}
              count={Math.ceil(
                filteredInternshipIntention.length / itemsPerPage
              )}
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
              <Typography component={'span'} variant='h5' color='textSecondary'>
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
          <Typography component={'span'} className={classes.heading}>
            {name}
          </Typography>
          <Typography
            component={'span'}
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
              <Typography component={'span'}>{internship.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component={'span'} className={classes.bold}>
                Rut:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography component={'span'}>{internship.rut}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component={'span'} className={classes.bold}>
                Matrícula:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography component={'span'}>
                {internship.enrollmentNumber}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Correo:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography component={'span'}>{internship.email}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component={'span'}>
                <Box fontWeight='fontWeightMedium'>Carrera:</Box>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography component={'span'}>
                {internship.careerName}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '.5rem' }}>
              <Typography component={'span'}>
                Práctica {internship.internshipNumber}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <DenyButton color='warning' onClick={() => setShowRejectModal(true)}>
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
    <BootstrapDialog
      fullWidth
      onClose={closeModal}
      aria-labelledby='customized-dialog-title'
      open={showRejectModal}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={closeModal}>
        Rechazar intención de práctica
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {`¿Está seguro de rechazar Práctica ${internship.internshipNumber} de ${internship.name}?`}
        </Typography>

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
        <DialogActions>
          <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
          <DenyButton color='warning' onClick={handleReject}>
            Confirmar rechazo
          </DenyButton>
        </DialogActions>
      </DialogActions>
    </BootstrapDialog>
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
    <BootstrapDialog
      fullWidth
      onClose={closeModal}
      aria-labelledby='customized-dialog-title'
      open={showApprovalModal}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={closeModal}>
        Aprobar intención de práctica
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {`Aprobar intención de Práctica ${internship.internshipNumber} de ${internship.name}.`}
        </Typography>
        <Typography gutterBottom>
          Adjunte los archivos correspondientes.
        </Typography>

        <DropzoneArea
          showFileNames
          acceptedFiles={['application/pdf']}
          onChange={handleLetterFile}
        />
        <DialogContentText />
        <Typography gutterBottom>
          Puede añadir observaciones pertinentes en el siguiente campo:
        </Typography>
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
      </DialogActions>
    </BootstrapDialog>
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
