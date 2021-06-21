import {
  Grid,
  Button,
  Typography,
  Container,
  ListItem,
  ListItemText,
  Divider,
  DialogActions,
  Dialog,
  DialogContentText,
  withStyles,
  DialogContent
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import CareerSelector from '../../utils/CareerSelector';
import { grey } from '@material-ui/core/colors';
const ApproveButton = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main
  }
}))(Button);

const SecondaryButton = withStyles((theme) => ({
  root: {
    color: grey[700]
  }
}))(Button);

function ApprovalModal({ application, closeModal, showApprovalModal }) {
  const [letterFile, setLetterFile] = useState([]);

  function handleLetterFile(files) {
    setLetterFile(files);
  }
  function handleApprove() {
    const { studentId, internshipId } = application;

    letterFile.forEach((file) => {
      storage
        .ref()
        .child(
          `students-docs/${studentId}/${internshipId}/seguro-practica/${file.name}`
        )
        .put(file);
    });
    db.collection('applications')
      .doc(application.aplicationId)
      .set(
        { seguroDisponible: true, alreadyDownloaded: true },
        { merge: true }
      );
    closeModal();
  }
  return (
    <Dialog fullWidth open={showApprovalModal} onClose={closeModal}>
      <DialogContent>
        <DialogContentText>
          Adjunte el seguro de práctica de {application.studentName}
        </DialogContentText>
        <DropzoneArea showFileNames onChange={handleLetterFile} />
        <DialogContentText />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
        <ApproveButton onClick={handleApprove}>Enviar seguro</ApproveButton>
      </DialogActions>
    </Dialog>
  );
}

function AprobadosItem({ application, careerId }) {
  const [showApprovalModal, setShowApprovalModal] = useState();
  const closeModal = () => {
    setShowApprovalModal(false);
  };

  return (
    <>
      <Container>
        <ListItem button onClick={(e) => setShowApprovalModal(true)}>
          <ListItemText
            primary={application.studentName}
            secondary={`Práctica ${application.internshipNumber} - ${application.Empresa} - ${application.email}`}
          />
        </ListItem>
        <Divider />
      </Container>
      <ApprovalModal
        application={application}
        closeModal={closeModal}
        showApprovalModal={showApprovalModal}
      />
    </>
  );
}

function ExportApprovedStudent() {
  const [careerId, setCareerId] = useState();
  const [usersExport, setusersExport] = useState([]);
  const [userDate, setuserDate] = useState([]);
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
            .set({ aplicationId: doc.id }, { merge: true });
        });

        setusersExport([...exportar]);
        setseguroUsuario([...seguro]);
      });
  }, []);

  useEffect(() => {
    db.collection('users').onSnapshot((querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      setuserDate([...user]);
    });
  }, []);

  var downloadTxtFile = () => {
    var approvedStudents = '';

    usersExport.forEach((doc) => {
      let datos = userDate.find((usuario) => usuario.email === doc.email);
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
        .set({ alreadyDownloaded: true }, { merge: true });
    });
  };
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
        <Button onClick={downloadTxtFile}>
          Descargar lista de estudiantes con postulación aprobada
        </Button>
      </Container>

      <Container style={{ marginTop: '2rem' }}>
        <CareerSelector careerId={careerId} setCareerId={setCareerId} />
      </Container>
      <Container></Container>
      {seguroUsuario.map((doc) => (
        <>
          {careerId === doc.careerId && (
            <AprobadosItem application={doc} careerId={careerId} />
          )}
          {careerId === 'general' && (
            <AprobadosItem application={doc} careerId={careerId} />
          )}
        </>
      ))}
    </Grid>
  );
}

export default ExportApprovedStudent;
