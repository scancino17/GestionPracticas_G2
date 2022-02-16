import {
  Grid,
  Typography,
  Container,
  ListItem,
  ListItemText,
  Divider,
  List,
  TextField,
  Button
} from '@material-ui/core';
import ReactExport from 'react-export-excel-xlsx-fix';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';
import { approvedApplication } from '../../InternshipStates';
import { useSupervisor } from '../../providers/Supervisor';
import { DEFAULT_CAREER } from '../../providers/User';

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

function UploadModal({ internship, close, show }) {
  const [file, setFile] = useState([]);
  const { submitInsurance } = useSupervisor();

  function handleSubmit() {
    submitInsurance(internship, file);
    close();
  }

  return (
    <BootstrapDialog
      fullWidth
      onClose={close}
      aria-labelledby='customized-dialog-title'
      open={show}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={close}>
        Adjuntar seguro de práctica
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Adjunte el seguro de práctica de {internship.studentName}
        </Typography>
        <DropzoneArea
          showFileNames
          filesLimit={1}
          acceptedFiles={['application/pdf']}
          onChange={(files) => setFile(files)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button
          variant='contained'
          color='primary'
          disabled={file.length === 0 ? true : false}
          onClick={handleSubmit}>
          Enviar seguro
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function StudentItem({ internship }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ListItem button onClick={(e) => setShowModal(true)}>
        <ListItemText
          primary={internship.studentName}
          secondary={`${internship.applicationData['Rut del estudiante']} - Práctica ${internship.applicationData.internshipNumber} - ${internship.careerInitials}`}
        />
      </ListItem>
      <Divider />
      <UploadModal
        internship={internship}
        close={() => setShowModal(false)}
        show={showModal}
      />
    </>
  );
}

function Insurance() {
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [name, setName] = useState('');
  const [usersExport, setUsersExport] = useState([]);
  const [usersInsurance, setUsersInsurance] = useState([]);
  const itemsPerPage = 7;
  const [page, setPage] = useState(1);
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const { internships } = useSupervisor();

  useEffect(() => {
    const exportar = [];
    const seguro = [];

    internships
      .filter((item) => item.status === approvedApplication)
      .forEach((internship) => {
        if (!internship.alreadyDownloaded) {
          const termino = YearMonthDay(
            internship.applicationData['Fecha de término'].toDate()
          );
          const inicio = YearMonthDay(
            internship.applicationData['Fecha de inicio'].toDate()
          );
          exportar.push({
            id: internship.id,
            ...internship.applicationData,
            stringInicio: inicio,
            stringTermino: termino,
            carrera: internship.careerName
          });
        }
        if (!internship.seguroDisponible) {
          seguro.push(internship);
        }
      });

    setUsersExport([...exportar]);
    setUsersInsurance([...seguro]);
  }, [internships]);

  const filteredInsuranceList = useMemo(() => {
    if (usersInsurance) {
      let filtered = usersInsurance.slice();
      if (selectedCareerId !== 'general')
        filtered = filtered.filter(
          (item) => item.careerId === selectedCareerId
        );
      if (name !== '')
        filtered = filtered.filter((item) => item.studentName.includes(name));
      return filtered;
    } else return [];
  }, [usersInsurance, name, selectedCareerId]);

  function YearMonthDay(date) {
    return date.toLocaleTimeString(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  }

  function ExportarExcel() {
    return (
      <ExcelFile
        element={
          <Button
            fullWidth
            color='primary'
            variant='contained'
            startIcon={<GetAppIcon />}
            onClick={() =>
              usersExport.forEach((doc) =>
                db
                  .collection('internships')
                  .doc(doc.id)
                  .update({ alreadyDownloaded: true })
              )
            }>
            Exportar postulaciones aprobadas
          </Button>
        }
        filename='Estudiantes para seguro'>
        <ExcelSheet data={usersExport} name='Estudiantes para seguro'>
          <ExcelColumn
            label='Nombre estudiante'
            value='Nombre del estudiante'
          />
          <ExcelColumn label='N° de Matrícula' value='Número de matrícula' />
          <ExcelColumn label='RUT estudiante' value='Rut del estudiante' />
          <ExcelColumn label='Carrera' value='carrera' />
          <ExcelColumn label='Tipo de práctica' value='internshipNumber' />
          <ExcelColumn label='Fecha de inicio' value='stringInicio' />
          <ExcelColumn label='Fecha de término' value='stringTermino' />
          <ExcelColumn label='Empresa' value='Empresa' />
          <ExcelColumn label='Correo' value='Correo del estudiante' />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Import.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Seguros de práctica de estudiantes</Typography>
      </div>

      <Container style={{ marginTop: '2rem' }}>
        <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
          <Grid item xs={12} sm={12} lg={4}>
            <TextField
              fullWidth
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={4}>
            <CareerSelector
              careerId={selectedCareerId}
              setCareerId={setSelectedCareerId}
            />
          </Grid>
          <Grid item xs={12} sm={7} lg={4}>
            <ExportarExcel />
          </Grid>
        </Grid>

        {filteredInsuranceList.length > 0 ? (
          <>
            <List>
              {filteredInsuranceList
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map(
                  (doc) =>
                    (selectedCareerId === DEFAULT_CAREER ||
                      selectedCareerId === doc.careerId) && (
                      <StudentItem
                        key={doc.id}
                        internship={doc}
                        careerId={selectedCareerId}
                      />
                    )
                )}
            </List>
            <Grid
              container
              justifyContent='flex-end'
              style={{ marginTop: '2rem' }}>
              {selectedCareerId && (
                <Pagination
                  count={Math.ceil(filteredInsuranceList.length / itemsPerPage)}
                  style={{ marginBottom: '40px' }}
                  page={page}
                  color='primary'
                  onChange={(_, val) => setPage(val)}
                />
              )}
            </Grid>
          </>
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
                alt='Sin seguros de práctica disponibles'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay seguros de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

export default Insurance;
