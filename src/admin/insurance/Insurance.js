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
import ReactExport from 'react-export-excel';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';

function UploadModal({ application, close, show }) {
  const [file, setFile] = useState([]);

  function handleSubmit() {
    const { studentId, internshipId } = application;

    file.forEach((file) => {
      storage
        .ref()
        .child(
          `students-docs/${studentId}/${internshipId}/seguro-practica/${file.name}`
        )
        .put(file);
    });

    db.collection('applications')
      .doc(application.id)
      .update({ seguroDisponible: true, alreadyDownloaded: true });

    close();
  }

  return (
    <Dialog fullWidth open={show} onClose={close}>
      <DialogTitle>
        Adjunte el seguro de práctica de {application.studentName}
      </DialogTitle>
      <DialogContent>
        <DropzoneArea showFileNames onChange={(files) => setFile(files)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Enviar seguro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function StudentItem({ application }) {
  const [showModal, setShowModal] = useState();

  return (
    <>
      <ListItem button onClick={(e) => setShowModal(true)}>
        <ListItemText
          primary={application.studentName}
          secondary={`Práctica ${application.internshipNumber} - ${application.Empresa} - ${application.email}`}
        />
      </ListItem>
      <Divider />
      <UploadModal
        application={application}
        close={() => setShowModal(false)}
        show={showModal}
      />
    </>
  );
}

function Insurance() {
  const [careerId, setCareerId] = useState('general');
  const [name, setName] = useState('');
  const [usersExport, setUsersExport] = useState([]);
  const [usersInsurance, setUsersInsurance] = useState([]);
  const [filteredUsersInsurance, setFilteredUsersInsurance] = useState([]);
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {
    db.collection('applications')
      .where('status', '==', 'Aprobado')
      .onSnapshot((querySnapshot) => {
        const exportar = [];
        const seguro = [];
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          console.log(data);
          if (!data.alreadyDownloaded) {
            const termino = YearMonthDay(data['Fecha de término'].toDate());
            const inicio = YearMonthDay(data['Fecha de inicio'].toDate());

            exportar.push({
              ...data,
              stringInicio: inicio,
              stringTermino: termino
            });
          }
          if (!data.seguroDisponible) seguro.push(data);
        });

        setUsersExport([...exportar]);
        setUsersInsurance([...seguro]);
        if (seguro) setFilteredUsersInsurance(applyFilter(seguro));
      });
  }, []);

  useEffect(() => {
    if (usersInsurance) setFilteredUsersInsurance(applyFilter(usersInsurance));
  }, [careerId, name]);

  function applyFilter(list) {
    let filtered = list.slice();
    if (careerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === careerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    return filtered;
  }

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
            onClick={(e) =>
              usersExport.forEach((doc) => {
                db.collection('applications')
                  .doc(doc.id)
                  .set({ alreadyDownloaded: true }, { merge: true });
              })
            }>
            Lista de estudiantes con postulación aprobada
          </Button>
        }
        filename='Estudiantes para seguro'>
        <ExcelSheet data={usersExport} name='Estudiantes para seguro'>
          <ExcelColumn label='Nombre' value='Nombre del estudiante' />
          <ExcelColumn label='Matrícula' value='Número de matrícula' />
          <ExcelColumn label='Rut' value='Rut del estudiante' />
          <ExcelColumn label='Correo' value='Correo del estudiante' />
          <ExcelColumn label='Nro práctica' value='internshipNumber' />
          <ExcelColumn label='Empresa' value='Empresa' />
          <ExcelColumn label='Fecha de inicio' value='stringInicio' />
          <ExcelColumn label='Fecha de término' value='stringTermino' />
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
        <Grid container justify='flex-end' spacing={2}>
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
            <CareerSelector careerId={careerId} setCareerId={setCareerId} />
          </Grid>
        </Grid>
        <List>
          {filteredUsersInsurance
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map(
              (doc) =>
                (careerId === 'general' || careerId === doc.careerId) && (
                  <StudentItem application={doc} careerId={careerId} />
                )
            )}
        </List>
        <Grid container justify='flex-end' style={{ marginTop: '2rem' }}>
          {careerId && (
            <Pagination
              count={Math.ceil(filteredUsersInsurance.length / itemsPerPage)}
              page={page}
              color='primary'
              onChange={(_, val) => setPage(val)}
            />
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

export default Insurance;
