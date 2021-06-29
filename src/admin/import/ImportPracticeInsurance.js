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

function ExportApprovedStudent() {
  const [careerId, setCareerId] = useState();
  const [usersExport, setusersExport] = useState([]);
  const [userData, setuserData] = useState([]);
  const [seguroUsuario, setseguroUsuario] = useState([]);

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
            exportar.push(doc.data());
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

  useEffect(() => {
    db.collection('users').onSnapshot((querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      setuserData([...user]);
    });
  }, []);

  function downloadTxtFile() {
    var approvedStudents = '';

    usersExport.forEach((doc) => {
      let datos = userData.find((usuario) => usuario.email === doc.email);
      let datosFormulario = usersExport.find(
        (usuario) => usuario.email === doc.email
      );
      approvedStudents +=
        datos.name +
        ', ' +
        doc.careerId +
        ', ' +
        datos.enrollmentNumber +
        ', ' +
        datos.rut +
        ', ' +
        datos.email +
        ', ' +
        datos.currentInternship.number +
        ', ' +
        datosFormulario.Empresa +
        ', ' +
        YearMonthDay(datosFormulario['Fecha de inicio'].toDate()) +
        ', ' +
        YearMonthDay(datosFormulario['Fecha de término'].toDate()) +
        '\n';
    });
    const element = document.createElement('a');
    const file = new Blob([approvedStudents], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'Postulaciones aprobadas.txt';
    document.body.appendChild(element);
    element.click();
    approvedStudents = '';

    usersExport.forEach((doc) => {
      db.collection('applications')
        .doc(doc.aplicationId)
        .update({ alreadyDownloaded: true });
    });
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
            <Button
              color='primary'
              variant='contained'
              startIcon={<GetAppIcon />}
              onClick={downloadTxtFile}>
              Lista de estudiantes con postulación aprobada
            </Button>
            <CareerSelector careerId={careerId} setCareerId={setCareerId} />
          </Grid>

          <List>
            {seguroUsuario.map((doc) => (
              <>
                {careerId === doc.careerId && (
                  <StudentItem application={doc} careerId={careerId} />
                )}
                {careerId === 'general' && (
                  <StudentItem application={doc} careerId={careerId} />
                )}
              </>
            ))}
          </List>
        </Grid>
      </Container>
    </Grid>
  );
}

export default ExportApprovedStudent;
