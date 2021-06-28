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
import ReactExport from 'react-export-excel';
import GetAppIcon from '@material-ui/icons/GetApp';
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
            .set({ aplicationId: doc.id }, { merge: true });
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
    console.log(usersExport);
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
        <ExportarExcel />
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
