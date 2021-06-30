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
  List
} from '@material-ui/core';
import ReactExport from 'react-export-excel';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';

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
      .doc(application.aplicationId)
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
  const [careerId, setCareerId] = useState();
  const [usersExport, setusersExport] = useState([]);

  const [seguroUsuario, setseguroUsuario] = useState([]);

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
          if (
            doc.data().alreadyDownloaded === false ||
            doc.data().alreadyDownloaded === undefined
          ) {
            const termino = YearMonthDay(
              doc.data()['Fecha de término'].toDate()
            );
            const inicio = YearMonthDay(doc.data()['Fecha de inicio'].toDate());

            exportar.push({
              ...doc.data(),
              stringInicio: inicio,
              stringTermino: termino
            });
          }
          if (
            doc.data().seguroDisponible === false ||
            doc.data().seguroDisponible === undefined
          ) {
            seguro.push(doc.data());
          }
          db.collection('applications')
            .doc(doc.id)
            .update({ aplicationId: doc.id });
        });

        setusersExport([...exportar]);
        setseguroUsuario([...seguro]);
      });
  }, []);

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
                  .doc(doc.aplicationId)
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
        <Typography variant='h4'>
          Lista de estudiantes para solicitar seguro
        </Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid container direction='column' spacing={2}>
          <Grid item container justify='space-between'>
            <ExportarExcel />
            <CareerSelector careerId={careerId} setCareerId={setCareerId} />
          </Grid>
          <List>
            {seguroUsuario.map(
              (doc) =>
                (careerId === 'general' || careerId === doc.careerId) && (
                  <StudentItem application={doc} careerId={careerId} />
                )
            )}
          </List>
        </Grid>
      </Container>
    </Grid>
  );
}

export default Insurance;
