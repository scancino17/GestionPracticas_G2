import {
  Grid,
  Button,
  Typography,
  Container,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  TextField
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

function UploadModal({ internship, close, show }) {
  const [file, setFile] = useState([]);
  const { submitInsurance } = useSupervisor();

  function handleSubmit() {
    submitInsurance(internship, file);
    close();
  }

  return (
    <Dialog fullWidth open={show} onClose={close}>
      <DialogTitle>
        Adjunte el seguro de práctica de {internship.studentName}
      </DialogTitle>
      <DialogContent>
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
    </Dialog>
  );
}

function StudentItem({ internship }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ListItem button onClick={(e) => setShowModal(true)}>
        <ListItemText
          primary={internship.studentName}
          secondary={`${internship.applicationData['Rut del estudiante']} - ${internship.applicationData['Número de matrícula']} - Práctica ${internship.applicationData.internshipNumber} - ${internship.careerName}`}
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
  const itemsPerPage = 8;
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
            stringTermino: termino
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
            Lista de estudiantes con postulación aprobada
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
        <Grid container justifyContent='flex-end' spacing={2}>
          <Grid item>
            <ExportarExcel />
          </Grid>
          <Grid item style={{ flexGrow: 1 }} />
          <Grid item>
            <TextField
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <CareerSelector
              careerId={selectedCareerId}
              setCareerId={setSelectedCareerId}
            />
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
