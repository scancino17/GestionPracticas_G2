import React, { useState, useMemo, useEffect } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  List,
  Slide
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { sentExtension } from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import GetAppIcon from '@material-ui/icons/GetApp';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

function ExtensionList() {
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const { userRole } = useUser();
  const { internships } = useSupervisor();

  const sentExtensionList = useMemo(() => {
    if (internships)
      return internships.filter(
        (item) => item.extensionStatus === sentExtension
      );
    else return [];
  }, [internships]);

  const filteredInternships = useMemo(() => {
    let filtered = sentExtensionList.slice();
    if (selectedCareerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === selectedCareerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    return filtered;
  }, [sentExtensionList, selectedCareerId, name]);

  function ExportarExcel() {
    let temp = [];
    if (filteredInternships) {
      filteredInternships.map((doc) =>
        temp.push({
          id: doc.id,
          nombre: doc.studentName,
          matricula: doc.applicationData['Número de matrícula'],
          rut: doc.applicationData['Rut del estudiante'],
          carrera: doc.careerName,
          practica: doc.internshipNumber,
          email: doc.studentEmail
        })
      );
    }
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
        filename={`Solicitudes de extensión de práctica`}>
        <ExcelSheet data={temp} name='Extensiones de práctica'>
          <ExcelColumn label='Nombre estudiante' value='nombre' />
          <ExcelColumn label='N° de Matrícula' value='matricula' />
          <ExcelColumn label='RUT estudiante' value='rut' />
          <ExcelColumn label='Carrera' value='carrera' />
          <ExcelColumn label='Tipo de práctica' value='practica' />
          <ExcelColumn label='Correo' value='email' />
        </ExcelSheet>
      </ExcelFile>
    );
  }
  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Extension.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Extensiones de prácticas</Typography>
      </div>
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
          {userRole === ADMIN_ROLE && (
            <Grid item xs={12} sm={4}>
              <CareerSelector
                careerId={selectedCareerId}
                setCareerId={setSelectedCareerId}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={4}>
            <ExportarExcel />
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filteredInternships.length > 0 ? (
          <List>
            {filteredInternships.map((internship) => (
              <div key={internship.id}>
                <IntershipItem key={internship.id} internship={internship} />
                <Divider />
              </div>
            ))}
          </List>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justifyContent='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img
                src='health.png'
                width='300'
                alt='Sin extensiones de práctica'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay extensiones de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

function IntershipItem({ internship }) {
  const [showApproved, setShowApproved] = useState(false);
  const [showDenied, setShowDenied] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [reason, setReason] = useState('');
  const { rejectExtension, approveExtension } = useSupervisor();

  function TransformDate(date) {
    return (
      date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()
    );
  }

  function handleExtensionDenied() {
    rejectExtension(internship, reason);
  }

  function handleExtensionApproved() {
    approveExtension(internship, reason);
  }

  return (
    <>
      <ListItem
        button
        onClick={() => {
          setShowExtension(true);
        }}>
        <ListItemText
          primary={internship.studentName}
          secondary={`${internship.applicationData['Rut del estudiante']} - ${internship.applicationData['Número de matrícula']} - Práctica ${internship.internshipNumber} - ${internship.careerName}`}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              setShowExtension(true);
            }}>
            <NavigateNext />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {internship && (
        <BootstrapDialog
          fullWidth
          onClose={() => setShowExtension(false)}
          aria-labelledby='customized-dialog-title'
          open={showExtension}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => setShowExtension(false)}>
            Solicitud de extensión
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  disabled={true}
                  variant='outlined'
                  label='Razón de la solicitud'
                  value={internship.reasonExtension}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  disabled={true}
                  variant='outlined'
                  label='Fecha actual'
                  value={
                    internship.applicationData['Fecha de término']
                      ? TransformDate(
                          internship.applicationData[
                            'Fecha de término'
                          ].toDate()
                        )
                      : null
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  disabled={true}
                  fullWidth
                  variant='outlined'
                  label='Fecha propuesta'
                  value={
                    internship.dateExtension
                      ? TransformDate(internship.dateExtension.toDate())
                      : null
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setShowDenied(true)}>
              Rechazar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setShowApproved(true);
              }}>
              Aceptar
            </Button>
          </DialogActions>
        </BootstrapDialog>
      )}
      <BootstrapDialog
        fullWidth
        onClose={() => {
          setShowApproved(false);
          setShowDenied(false);
        }}
        TransitionComponent={Transition}
        aria-labelledby='customized-dialog-title'
        open={showApproved || showDenied}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={() => {
            setShowApproved(false);
            setShowDenied(false);
          }}>
          {showApproved ? 'Aprobar' : 'Rechazar'} solicitud de extensión
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            label='Observaciones'
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={() => {
              setShowApproved(false);
              setShowDenied(false);
            }}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color={showApproved ? 'primary' : 'secondary'}
            onClick={() => {
              if (showApproved) handleExtensionApproved();
              else handleExtensionDenied();
              setShowApproved(false);
              setShowDenied(false);
              setShowExtension(false);
            }}>
            {showApproved ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default ExtensionList;
