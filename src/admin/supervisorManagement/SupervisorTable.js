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
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { db, functions } from '../../firebase';
import { grey } from '@material-ui/core/colors';
import { DeleteForever, Edit, Replay } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  tableCell: {
    '& .appear-item': {
      opacity: '0'
    },
    '&:hover .appear-item': {
      opacity: '1'
    }
  },
  buttonMargin: {
    marginLeft: '.5rem',
    marginRight: '.5rem'
  },
  textFieldMargin: {
    marginBottom: '1rem'
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
  }, [excludeGeneral]);

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
  const classes = useStyles();
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
          className={classes.textFieldMargin}
          label='Nombre de encargado'
          fullWidth
          value={supervisorName}
          onChange={(e) => setSupervisorName(e.target.value)}
        />
        <TextField
          className={classes.textFieldMargin}
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
        <SecondaryButton color='primary' onClick={closeModal}>
          Cancelar
        </SecondaryButton>
        <Button color='primary' onClick={handleSubmit} disabled={disableSubmit}>
          Crear cuenta de supervisor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditSupervisorModal = ({ closeModal, supervisor, update }) => {
  const classes = useStyles();
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
          className={classes.textFieldMargin}
          label='Nombre de encargado'
          fullWidth
          value={supervisorName}
          onChange={(e) => setSupervisorName(e.target.value)}
        />
        <CareerSelector
          className={classes.textFieldMargin}
          careerId={careerId}
          setCareerId={setCareerId}
          excludeGeneral
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton color='primary' onClick={closeModal}>
          Cancelar
        </SecondaryButton>
        <Button color='primary' onClick={handleSubmit} disabled={disableSubmit}>
          Editar cuenta de supervisor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteSupervisorModal = ({ closeModal, supervisor, update }) => {
  const [disableSubmit, setDisableSubmit] = useState(true);

  const handleSubmit = () => {
    console.log('TODO');
    closeModal();
    update();
  };

  return (
    <Dialog fullWidth open onClose={closeModal}>
      <DialogTitle>Eliminar encargado</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Está seguro de eliminar este encargado? Esta acción no puede ser
          revertida.
        </DialogContentText>
        <FormControlLabel
          control={
            <Checkbox
              checked={!disableSubmit}
              onChange={() => setDisableSubmit(!disableSubmit)}
              color='primary'
            />
          }
          label={`Si, deseo eliminar la cuenta de ${supervisor.displayName}`}
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton color='primary' onClick={closeModal}>
          Cancelar
        </SecondaryButton>
        <DenyButton
          color='primary'
          onClick={handleSubmit}
          disabled={disableSubmit}>
          Eliminar cuenta de supervisor
        </DenyButton>
      </DialogActions>
    </Dialog>
  );
};

function SupervisorTable() {
  const classes = useStyles();
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
          <IconButton
            className={classes.buttonMargin}
            onClick={updateSupervisorList}>
            <Replay />
          </IconButton>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: '2rem' }}>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>ID Carrera</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Último Ingreso</TableCell>
              <TableCell style={{ paddingRight: '2rem' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisors.map((supervisor) => (
              <TableRow
                className={classes.tableCell}
                hover
                key={supervisor.uid}>
                <TableCell style={{ paddingLeft: '2rem' }}>
                  {supervisor.displayName}
                </TableCell>
                <TableCell>{supervisor.email}</TableCell>
                <TableCell>{supervisor.customClaims.careerId}</TableCell>
                <TableCell>{supervisor.metadata.creationTime}</TableCell>
                <TableCell>{supervisor.metadata.lastSignInTime}</TableCell>
                <TableCell
                  className='appear-item'
                  style={{ paddingRight: '2rem' }}>
                  <IconButton
                    size='small'
                    className={classes.buttonMargin}
                    onClick={() =>
                      setShowModal(
                        <EditSupervisorModal
                          closeModal={closeModal}
                          supervisor={supervisor}
                          update={updateSupervisorList}
                        />
                      )
                    }>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size='small'
                    className={classes.buttonMargin}
                    onClick={() =>
                      setShowModal(
                        <DeleteSupervisorModal
                          closeModal={closeModal}
                          supervisor={supervisor}
                          update={updateSupervisorList}
                        />
                      )
                    }>
                    <DeleteForever />
                  </IconButton>
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
