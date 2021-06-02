import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Fab,
  Modal,
  Box
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Check, Clear } from '@material-ui/icons';
import FormView from './FormView';
import Selector from './Selector';

const useStyles = makeStyles((theme) => ({
  root: {
    // Este flex: auto está aqui para que los form abajo puedan ocupar todo el tamaño del grid que los contiene
    // El '& .MuiTextField-root' tiene básicamente la misma funcionalidad.
    flex: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  topBottomPadding: {
    paddingTop: '1rem',

    paddingBottom: '1rem'
  },
  fabAccept: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  fabDecline: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(18)
  }
}));
function FormCheck() {
  const { ApplicationId } = useParams();
  const [application, setApplication] = useState([]);
  const [applicationUser, setApplicationUser] = useState([]);

  const [flag, setFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const classes = useStyles();

  useEffect(() => {
    db.collection('formApplication')
      .doc(ApplicationId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) {
          setApplication(data);
        }
      });
    db.collection('users')
      .doc(application.student)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) {
          setApplication(data);
        }
      });
  }, []);

  useEffect(() => {
    db.collection('users')
      .doc(application.student)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) {
          setApplicationUser(data);
        }
      });
  }, [application]);
  useEffect(() => {
    setFlag(false);
  }, [flag]);
  function handleApprove() {
    db.collection('formApplication')
      .doc(ApplicationId)
      .update({ status: 'Aprobado' });
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: 'En curso' });

    db.collection('mails').add({
      to: applicationUser.email,
      template: {
        name: 'Approved',
        data: {
          from_name: applicationUser.name
        }
      }
    });
  }

  function handleReject() {
    setShow(false);
    db.collection('formApplication')
      .doc(ApplicationId)
      .update({ status: 'Rechazado', reason: rejectReason });

    db.collection('mails').add({
      to: applicationUser.email,
      template: {
        name: 'Failed',
        data: {
          from_name: applicationUser.name,
          result: rejectReason
        }
      }
    });
  }
  return (
    <>
      <Fab
        variant='extended'
        color='primary'
        className={classes.fabAccept}
        onClick={() => handleApprove}>
        <Check />
        Aceptar
      </Fab>
      <Fab
        variant='extended'
        color='secondary'
        className={classes.fabDecline}
        onClick={() => setShow(true)}>
        <Clear />
        Rechazar
      </Fab>

      <Container>
        <Grid
          container
          direction='column'
          spacing={5}
          className={classes.topBottomPadding}>
          <Typography variant='h2'> Revisión Postulación</Typography>
          {application.form &&
            application.form.map((step) => (
              <>
                <Grid item>
                  <FormView
                    readOnly
                    form={step.form}
                    flag={flag}
                    setFlag={setFlag}
                  />
                </Grid>
              </>
            ))}
        </Grid>
      </Container>
      {show && (
        <Modal
          open={show}
          onClose={() => setShow(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Box bgcolor='white' width='70%' padding={8}>
            <Grid>
              <Typography>Razón de rechazo:</Typography>
              <TextField
                fullWidth
                variant='outlined'
                xs={12}
                required
                id='standard-required'
                label={'Razon'}
                multiline
                rowsMax={4}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Button
                variant='contained'
                color='secondary'
                onClick={() => handleReject()}>
                Rechazar
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setShow(false)}>
                salir
              </Button>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}
export default FormCheck;
