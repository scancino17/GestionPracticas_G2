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
      filtered = filtered.filter((item) => item.name.includes(name));
    return filtered;
  }

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('internships').where('careerId', '==', user.careerId)
      : db.collection('internships');
    let unsubscribe;
    unsubscribe = dbRef.onSnapshot((querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.extensionStatus === sentExtension) {
          list.push({
            id: doc.id,
            name: data.studentName,
            careerId: data.careerId,
            ...data
          });
        }
      });

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
        <List>
          {filterInterships.map((internship) => (
            <>
              <IntershipItem key={internship.id} intership={internship} />
              <Divider />
            </>
          ))}
        </List>
      </Container>
    </Grid>
  );
}

function IntershipItem({ intership: internship }) {
  const [showApproved, setShowApproved] = useState(false);
  const [showDeined, setShowDenied] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [application, setApplication] = useState();
  const [internshipsExtension, setInternshipsExtension] = useState();
  const [idApplication, setIdApplication] = useState();
  const [reason, setReason] = useState('');
  const { user } = useAuth();

  function TransformDate(date) {
    return (
      date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()
    );
  }

  function handleExtensionDenied() {
    db.collection('internships')
      .doc(internshipsExtension.id)
      .update({
        extensionStatus: deniedExtension,
        dateExtension: '',
        reasonExtension: reason ? reason : ''

        //cambiar statusExeption
      });
    db.collection('mails').add({
      to: application.email,
      template: {
        name: 'ExtensionFailed',
        data: {
          from_name: application['Nombre del estudiante'],
          result: reason,
          rechazado_por: user.displayName
        }
      }
    });
  }

  function handleExtensionApproved() {
    application['Fecha de término'] = internshipsExtension.dateExtension;
    application['form'].forEach((step) => {
      step['form'].forEach((camp) => {
        if (
          camp['type'] === 'Campos predefinidos' &&
          camp['name'] === 'Fecha de término'
        ) {
          //cambiar el valor en el formulario
          camp['value'] = internshipsExtension.dateExtension;
        }
      });
    });
    //actualizar en la base de datos
    db.collection('applications')
      .doc(idApplication)
      .update({
        ...application
      });

    db.collection('internships').doc(internshipsExtension.id).update({
      extensionStatus: approvedExtension,
      dateExtension: internshipsExtension.dateExtension,
      reasonExtension: reason,
      'applicationData.Fecha de término': internshipsExtension.dateExtension
      //cambiar statusExeption
    });

    db.collection('mails').add({
      to: application.email,
      template: {
        name: 'ExtensionApproved ',
        data: {
          from_name: application['Nombre del estudiante'],
          aprobado_por: user.displayName,
          razon_aprobacion: reason ? reason : 'Sin observaciones'
        }
      }
    });
  }

  useEffect(() => {
    db.collection('users')
      .doc(internship.studentId)
      .get()
      .then((user) => {
        setIdApplication(user.data().currentInternship.lastApplication);
      });
  }, []);

  useEffect(() => {
    if (idApplication) {
      db.collection('applications')
        .doc(idApplication)
        .get()
        .then((appl) => setApplication(appl.data()));
    }
  }, [idApplication]);

  return (
    <>
      <ListItem
        button
        onClick={() => {
          setInternshipsExtension(internship);
          setShowExtension(true);
        }}>
        <ListItemText
          primary={internship.studentName}
          secondary={internship.applicationData.Empresa}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              setInternshipsExtension(internship);
              setShowExtension(true);
            }}>
            <NavigateNext />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {internshipsExtension && (
        <Dialog
          open={showExtension}
          onClose={() => setShowExtension(false)}
          TransitionComponent={Transition}
          maxWidth='sm'
          fullWidth={true}>
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
                  value={internshipsExtension.reasonExtension}
                />
              </Grid>
              <Grid item>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  variant='outlined'
                  label='Fecha propuesta'
                  value={
                    internshipsExtension.dateExtension
                      ? TransformDate(
                          internshipsExtension.dateExtension.toDate()
                        )
                      : null
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  multiline
                  rowsMax={4}
                  fullWidth
                  variant='outlined'
                  label='Fecha actual'
                  value={
                    application['Fecha de término']
                      ? TransformDate(application['Fecha de término'].toDate())
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
        open={showApproved || showDeined}
        onClose={() => {
          setShowApproved(false);
          setShowDenied(false);
        }}
        TransitionComponent={Transition}
        maxWidth='sm'
        fullWidth={true}>
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
              if (showApproved) {
                handleExtensionApproved();
              } else {
                handleExtensionDenied();
              }
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
