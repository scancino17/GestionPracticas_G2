import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Slider,
  Container,
  Input,
  Divider
} from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { db, storage } from '../../firebase';
import { GetApp } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { finishedInternship, reportNeedsChanges } from '../../InternshipStates';
import useAuth from '../../providers/Auth';

function ReportEvaluate() {
  const [value, setValue] = useState(40);
  const { studentId } = useParams();
  const { internshipId } = useParams();
  const [infoStudent, setInfoStudent] = useState();
  const [showChanges, SetShowChanges] = useState(false);
  const [showEvaluate, SetShowEvaluate] = useState(false);
  const [changes, SetChanges] = useState('');
  const history = useHistory();
  const [evaluateComment, setEvaluateComment] = useState('');
  const { user, userData } = useAuth();
  useEffect(() => {
    db.collection('users')
      .doc(studentId)
      .get()
      .then((user) => setInfoStudent(user.data()));
  }, []);
  function InternshipIntentionFileList({}) {
    const [url, setUrl] = useState();

    useEffect(() => {
      storage
        .ref(
          `/students-docs/${studentId}/${internshipId}/reports/${internshipId}.pdf`
        )
        .getDownloadURL()
        .then((url) => {
          setUrl(url);
        });
    }, []);

    return (
      <>
        <Button
          startIcon={<GetApp />}
          variant='contained'
          target='_blank'
          href={url}
          rel='noopener'>
          Informe
        </Button>
      </>
    );
  }

  function handleChanges() {
    db.collection('internships').doc(internshipId).update({
      status: reportNeedsChanges,
      reason: changes
    });

    db.collection('mails').add({
      to: infoStudent.email,
      template: {
        name: 'ReportFailed',
        data: {
          from_name: infoStudent.name,
          reason: changes,
          rechazado_por: userData.name
        }
      }
    });
  }

  function handleEvaluate() {
    db.collection('internships').doc(internshipId).update({
      status: finishedInternship,
      reason: evaluateComment,
      grade: value
    });

    db.collection('mails').add({
      to: infoStudent.email,
      template: {
        name: 'ReportApproved',
        data: {
          from_name: infoStudent.name,
          grade: value,
          reason: evaluateComment,
          aprovado_por: userData.name
        }
      }
    });
    db.collection('users').doc(studentId).update({ step: 3 });
  }
  return (
    <>
      <Grid container direction='column'>
        <Grid
          item
          style={{
            backgroundImage: "url('../../AdminBanner-Evaluate.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '2rem'
          }}>
          <Typography variant='h4'>
            Evaluación de informe de practica
          </Typography>
        </Grid>
        {infoStudent && (
          <Container style={{ marginTop: '2rem' }}>
            <Grid container direction='row' justify='space-around'>
              <Grid item>
                <Grid
                  container
                  direction='column'
                  spacing={3}
                  justify='space-evenly'>
                  <Typography variant='h5'>
                    Información del estudiante
                  </Typography>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      id='outlined-basic'
                      label='Nombre'
                      variant='outlined'
                      value={infoStudent.name}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      id='outlined-basic'
                      label='Matricula'
                      variant='outlined'
                      value={infoStudent.enrollmentNumber}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      id='outlined-basic'
                      label='Email'
                      variant='outlined'
                      value={infoStudent.email}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <Grid container spacing={3} direction='column'>
                      <Grid item>
                        <Typography variant='h5'>Documento </Typography>
                      </Grid>
                      <Grid item>
                        <Container>
                          <InternshipIntentionFileList />
                        </Container>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container align='center' justify='center'>
                  <Grid item>
                    <img
                      height='500'
                      src='../../AdminBanner-Evaluate-Divider.png'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              style={{ marginTop: '1rem' }}
              container
              direction='row'
              justify='flex-end'
              spacing={3}>
              <Grid item>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={() => SetShowChanges(true)}>
                  Solicitar Cambios
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => SetShowEvaluate(true)}>
                  Calificar
                </Button>
              </Grid>
            </Grid>
          </Container>
        )}
      </Grid>

      {/*Modals */}
      {showChanges && (
        <Dialog
          open={showChanges}
          onClose={() => SetShowChanges(false)}
          fullWidth>
          <DialogTitle>Solicitud de cambios</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label={'Cambios necesarios'}
              multiline
              rowsMax={4}
              onChange={(e) => SetChanges(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={() => SetShowChanges(false)}>
              Cancelar
            </Button>
            <Button
              color='primary'
              onClick={() => (
                handleChanges(),
                SetShowChanges(false),
                history.push('/evaluate-practice')
              )}>
              Confirmar solicitud
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={showEvaluate}
        onClose={() => SetShowEvaluate(false)}
        fullWidth>
        <DialogTitle>Evaluar Practica</DialogTitle>
        <DialogContent>
          <Grid container justify='center' alignContent='center'>
            <Grid item>
              <Typography variant='h2'>
                {value < 20
                  ? '😰'
                  : value < 30
                  ? '😢'
                  : value < 40
                  ? '😟'
                  : value < 50
                  ? '😐'
                  : value < 60
                  ? '🙂'
                  : value < 70
                  ? '😃'
                  : value >= 70
                  ? '🤩'
                  : null}
              </Typography>
            </Grid>
            <Slider
              min={10}
              max={70}
              marks={[
                { label: '1.0', value: 10 },
                { label: '2.0', value: 20 },
                { label: '3.0', value: 30 },
                { label: '4.0', value: 40 },
                { label: '5.0', value: 50 },
                { label: '6.0', value: 60 },
                { label: '7.0', value: 70 }
              ]}
              value={value}
              aria-labelledby='input-slider'
              onChange={(event, newValue) => setValue(newValue)}
            />
            <Input
              value={value}
              margin='dense'
              onChange={(event) =>
                event.target.value <= 70 ? setValue(event.target.value) : null
              }
              inputProps={{
                min: 10,
                max: 70,
                type: 'number'
              }}
            />
          </Grid>
          <Typography variant='h5' color={value < 40 ? 'error' : 'primary'}>
            Evaluar con nota: {value / 10}
          </Typography>
          <TextField
            fullWidth
            label={'Comentarios'}
            multiline
            rowsMax={4}
            onChange={(e) => setEvaluateComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={() => SetShowEvaluate(false)}>
            Cancelar
          </Button>
          <Button
            color='primary'
            onClick={() => (
              handleEvaluate(),
              SetShowEvaluate(false),
              history.push('/evaluate-practice')
            )}>
            Confirmar Evaluación
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default ReportEvaluate;
