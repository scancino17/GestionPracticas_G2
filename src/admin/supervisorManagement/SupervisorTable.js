import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  withStyles,
  Typography,
  Box
} from '@material-ui/core';
import { functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';
import { useSupervisor } from '../../providers/Supervisor';
import { grey } from '@material-ui/core/colors';
import { DeleteForever, Edit, Replay } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { DEFAULT_CAREER } from '../../providers/User';

const useStyles = makeStyles(() => ({
  tableCell: {
    '& .appear-item': {
      opacity: '0.75'
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
  const { careers } = useSupervisor();

  const careersList = useMemo(() => {
    if (careers)
      return careers.filter(
        (item) => !excludeGeneral || item.id !== DEFAULT_CAREER
      );
    else return [];
  }, [careers, excludeGeneral]);

  return (
    <TextField
      select
      fullWidth
      label='Carrera de encargado'
      value={careerId}
      onChange={(e) => setCareerId(e.target.value)}>
      {careersList.map((career) => {
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
    const createSupervisor = httpsCallable(functions, 'createSupervisor');

    createSupervisor({
      email: supervisorEmail,
      name: supervisorName,
      careerId: careerId
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
    const editSupervisor = httpsCallable(functions, 'editSupervisor');
    editSupervisor({
      uid: supervisor.uid,
      displayName: supervisorName,
      careerId: careerId
    });
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
    const deleteSupervisor = httpsCallable(functions, 'deleteSupervisor');
    deleteSupervisor({ uid: supervisor.uid });
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
          label={`Sí, deseo eliminar la cuenta de ${supervisor.displayName}`}
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
  const [supervisors, setSupervisors] = useState();
  const [loaded, isLoaded] = useState(false);
  const didMount = useRef(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const updateSupervisorList = () => {
    isLoaded(false);
    const listSupervisors = httpsCallable(functions, 'listSupervisors');
    listSupervisors().then((res) => {
      setSupervisors(res.data);
    });
  };

  useEffect(() => {
    updateSupervisorList();
  }, []);

  useEffect(() => {
    didMount.current ? isLoaded(true) : (didMount.current = true);
  }, [supervisors]);

  return (
    <>
      <TableContainer component={Paper}>
        <Grid container justifyContent='flex-end' style={{ padding: '1rem' }}>
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
        {loaded ? (
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
              {supervisors?.map((supervisor) => (
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
        ) : (
          <Grid direction='column' style={{ padding: '2rem' }}>
            <Skeleton animation='wave' width='100%' height='3rem' />
            <Skeleton animation='wave' width='100%' height='3rem' />
            <Skeleton animation='wave' width='100%' height='3rem' />
          </Grid>
        )}
      </TableContainer>
      <Typography style={{ marginTop: '1rem' }}>
        <Box fontStyle='italic' fontWeight='light'>
          Los cambios pueden tardar hasta un minuto en verse reflejados.
          Refresque la tabla si no ve reflejada la acción.
        </Box>
      </Typography>
      {showModal}
    </>
  );
}

export default SupervisorTable;
