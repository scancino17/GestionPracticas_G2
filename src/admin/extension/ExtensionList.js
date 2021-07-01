import React, { useEffect, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  List,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Slide,
  Button
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { db } from '../../firebase';
import {
  approvedExtension,
  deniedExtension,
  sentExtension
} from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import useAuth from '../../providers/Auth';
import firebase from 'firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

function ExtensionList() {
  const [name, setName] = useState('');
  const [careerId, setCareerId] = useState('general');
  const [internships, setInternships] = useState([]);
  const [filterInterships, setFilterInternships] = useState([]);
  const { user } = useAuth();

  function applyFilter(list) {
    let filtered = [...list];
    if (careerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === careerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    return filtered;
  }

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('internships').where('careerId', '==', user.careerId)
      : db.collection('internships');
    const unsubscribe = dbRef
      .where('extensionStatus', '==', sentExtension)
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) =>
          list.push({ id: doc.id, ...doc.data() })
        );
        setInternships(list);
        if (list) setFilterInternships(applyFilter(list));
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (internships) setFilterInternships(applyFilter(internships));
  }, [careerId, name]);

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Extension.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Extensiones de prácticas</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid container justify='flex-end' alignItems='center' spacing={4}>
          <Grid item>
            <TextField
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          {!user.careerId && (
            <Grid item>
              <CareerSelector careerId={careerId} setCareerId={setCareerId} />
            </Grid>
          )}
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filterInterships && filterInterships.lenght > 1 ? (
          <List>
            {filterInterships.map((internship) => (
              <>
                <IntershipItem key={internship.id} internship={internship} />
                <Divider />
              </>
            ))}
          </List>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justify='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img src='health.png' width='300' />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay extensiones de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

function IntershipItem({ internship }) {
  const [showApproved, setShowApproved] = useState(false);
  const [showDenied, setShowDenied] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [reason, setReason] = useState('');
  const { user } = useAuth();

  function TransformDate(date) {
    return (
      date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()
    );
  }

  function handleExtensionDenied() {
    db.collection('internships')
      .doc(internship.id)
      .update({
        extensionStatus: deniedExtension,
        dateExtension: '',
        reasonExtension: reason ? reason : 'Sin observaciones'

        //cambiar statusExeption
      });
    db.collection('mails').add({
      to: internship.studentEmail,
      template: {
        name: 'ExtensionFailed',
        data: {
          from_name: internship.studentName,
          result: reason,
          rechazado_por: user.displayName
        }
      }
    });

    db.collection('users')
      .doc(internship.studentId)
      .update({
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: deniedExtension,
          time: firebase.firestore.FieldValue.serverTimestamp()
        }
      });
  }

  function handleExtensionApproved() {
    db.collection('applications')
      .doc(internship.applicationId)
      .get()
      .then((doc) => {
        const application = doc.data();
        application['Fecha de término'] = internship.dateExtension;
        application['form'].forEach((step) => {
          step['form'].forEach((camp) => {
            if (
              camp['type'] === 'Campos predefinidos' &&
              camp['name'] === 'Fecha de término'
            ) {
              //cambiar el valor en el formulario
              camp['value'] = internship.dateExtension;
            }
          });
        });
        //actualizar en la base de datos
        db.collection('applications')
          .doc(internship.applicationId)
          .update({ ...application });

        db.collection('internships').doc(internship.id).update({
          extensionStatus: approvedExtension,
          dateExtension: internship.dateExtension,
          reasonExtension: reason,
          'applicationData.Fecha de término': internship.dateExtension
          //cambiar statusExeption
        });
      });

    db.collection('mails').add({
      to: internship.studentEmail,
      template: {
        name: 'ExtensionApproved',
        data: {
          from_name: internship.studentName,
          aprobado_por: user.displayName,
          razon_aprobacion: reason ? reason : 'Sin observaciones'
        }
      }
    });

    db.collection('users')
      .doc(internship.studentId)
      .update({
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: approvedExtension,
          time: firebase.firestore.FieldValue.serverTimestamp()
        }
      });
  }

  return (
    <>
      <ListItem
        button
        onClick={() => {
          setShowExtension(true);
        }}>
        <ListItemText
          primary={internship.studentName}
          secondary={internship.applicationData.Empresa}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              setShowExtension(true);
            }}>
            <NavigateNext />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {internship && (
        <Dialog
          open={showExtension}
          onClose={() => setShowExtension(false)}
          TransitionComponent={Transition}
          fullWidth>
          <DialogTitle>Solicitud de extensión</DialogTitle>

          <DialogContent>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  variant='outlined'
                  label='Razón de la solicitud'
                  value={internship.reasonExtension}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Fecha actual'
                  value={
                    internship.applicationData['Fecha de término']
                      ? TransformDate(
                          internship.applicationData[
                            'Fecha de término'
                          ].toDate()
                        )
                      : null
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Fecha propuesta'
                  value={
                    internship.dateExtension
                      ? TransformDate(internship.dateExtension.toDate())
                      : null
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setShowDenied(true)}>
              Rechazar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setShowApproved(true);
              }}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={showApproved || showDenied}
        onClose={() => {
          setShowApproved(false);
          setShowDenied(false);
        }}
        TransitionComponent={Transition}
        fullWidth>
        <DialogTitle>
          {showApproved ? 'Aprobar' : 'Rechazar'} solicitud de extensión
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            label='Observaciones'
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={() => {
              setShowApproved(false);
              setShowDenied(false);
            }}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color={showApproved ? 'primary' : 'secondary'}
            onClick={() => {
              if (showApproved) handleExtensionApproved();
              else handleExtensionDenied();
              setShowApproved(false);
              setShowDenied(false);
              setShowExtension(false);
            }}>
            {showApproved ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExtensionList;
