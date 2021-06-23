import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogContentText,
  DialogActions,
  MenuItem
} from '@material-ui/core';
import { db, functions } from '../../firebase';

function CareerSelector({ careerId, setCareerId, excludeGeneral = false }) {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
          temp.push({ id: doc.id, ...doc.data() });
        });
        setCareers(
          excludeGeneral
            ? temp.filter((career) => career.id !== 'general')
            : temp
        );
      });
  }, []);

  return (
    <TextField
      select
      fullWidth
      label='Carrera de encargado'
      value={careerId}
      onChange={(e) => setCareerId(e.target.value)}>
      {careers.map((career) => {
        return (
          <MenuItem key={career.id} value={career.id}>
            {career.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

const CreateSupervisorModal = ({ closeModal, update }) => {
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [careerId, setCareerId] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);

  const handleSubmit = () => {
    const createSupervisor = functions.httpsCallable('createSupervisor');
    createSupervisor({
      email: supervisorEmail,
      name: supervisorName,
      careerId: careerId,
      password: 'testtest'
    });
    closeModal();
    update();
  };

  useEffect(
    () => setDisableSubmit(!(supervisorName && supervisorEmail && careerId)),
    [supervisorName, supervisorEmail, careerId]
  );

  return (
    <Dialog fullWidth open onClose={closeModal}>
      <DialogTitle>Crear nuevo encargado</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Indique los siguientes datos para crear una cuenta de encargado. Se
          enviará un correo al email ingresado para establecer una contraseña.
        </DialogContentText>
        <TextField
          label='Nombre de encargado'
          fullWidth
          value={supervisorName}
          onChange={(e) => setSupervisorName(e.target.value)}
        />
        <TextField
          label='Email encargado'
          fullWidth
          value={supervisorEmail}
          onChange={(e) => setSupervisorEmail(e.target.value)}
        />
        <CareerSelector
          careerId={careerId}
          setCareerId={setCareerId}
          excludeGeneral
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={closeModal}>
          Cancelar
        </Button>
        <Button color='primary' onClick={handleSubmit} disabled={disableSubmit}>
          Crear cuenta de supervisor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditSupervisorModal = ({ closeModal, supervisor, update }) => {
  const [supervisorName, setSupervisorName] = useState('');
  const [careerId, setCareerId] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    setDisableSubmit(
      !(
        supervisor.displayName !== supervisorName ||
        supervisor.customClaims.careerId !== careerId
      )
    );
  }, [supervisorName, careerId, supervisor]);

  useEffect(() => {
    setSupervisorName(supervisor.displayName);
    setCareerId(supervisor.customClaims.careerId);
  }, [supervisor]);

  const handleSubmit = () => {
    console.log('TODO');
    closeModal();
    update();
  };

  return (
    <Dialog fullWidth open onClose={closeModal}>
      <DialogTitle>Editar encargado</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edite los campos a continuación para editar la información
          correspondiente.
        </DialogContentText>
        <TextField
          label='Nombre de encargado'
          fullWidth
          value={supervisorName}
          onChange={(e) => setSupervisorName(e.target.value)}
        />
        <CareerSelector
          careerId={careerId}
          setCareerId={setCareerId}
          excludeGeneral
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={closeModal}>
          Cancelar
        </Button>
        <Button color='primary' onClick={handleSubmit} disabled={disableSubmit}>
          Editar cuenta de supervisor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function SupervisorTable() {
  const [showModal, setShowModal] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

  const closeModal = () => {
    setShowModal(false);
  };

  const updateSupervisorList = () => {
    const listSupervisors = functions.httpsCallable('listSupervisors');
    listSupervisors().then((res) => {
      setSupervisors(res.data);
    });
  };

  useEffect(() => {
    updateSupervisorList();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Grid container justify='flex-end' style={{ padding: '1rem' }}>
          <Button
            color='primary'
            variant='contained'
            onClick={() =>
              setShowModal(
                <CreateSupervisorModal
                  closeModal={closeModal}
                  update={updateSupervisorList}
                />
              )
            }>
            Crear Encargado
          </Button>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>ID Carrera</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Último Ingreso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisors.map((supervisor) => (
              <TableRow key={supervisor.uid}>
                <TableCell>{supervisor.displayName}</TableCell>
                <TableCell>{supervisor.email}</TableCell>
                <TableCell>{supervisor.customClaims.careerId}</TableCell>
                <TableCell>{supervisor.metadata.creationTime}</TableCell>
                <TableCell>{supervisor.metadata.lastSignInTime}</TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      setShowModal(
                        <EditSupervisorModal
                          closeModal={closeModal}
                          supervisor={supervisor}
                          update={updateSupervisorList}
                        />
                      )
                    }>
                    Editar
                  </Button>
                  <Button>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showModal}
    </>
  );
}

export default SupervisorTable;
