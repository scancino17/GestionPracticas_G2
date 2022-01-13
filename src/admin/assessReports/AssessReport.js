import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Slider,
  Container,
  Input
} from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { db, storage } from '../../firebase';
import { GetApp } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { reportNeedsChanges, finishedInternship } from '../../InternshipStates';
import useAuth from '../../providers/Auth';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { serverTimestamp } from 'firebase/firestore';
import { StudentNotificationTypes } from '../../layout/NotificationMenu';

function AssessReport() {
  const [value, setValue] = useState(40);
  const { studentId } = useParams();
  const { internshipId } = useParams();
  const [infoStudent, setInfoStudent] = useState();
  const [showChanges, SetShowChanges] = useState(false);
  const [showEvaluate, SetShowEvaluate] = useState(false);
  const [changesEditorState, setChangesEditorState] = useState(
    EditorState.createEmpty()
  );
  const navigate = useNavigate();
  const [evaluateComment, setEvaluateComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    db.collection('users')
      .doc(studentId)
      .get()
      .then((user) => setInfoStudent(user.data()));
  }, []);

  function DownloadButton() {
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
      <Button
        startIcon={<GetApp />}
        variant='contained'
        target='_blank'
        href={url}
        rel='noopener'>
        Ver informe
      </Button>
    );
  }

  function handleChanges() {
    db.collection('internships')
      .doc(internshipId)
      .update({
        status: reportNeedsChanges,
        reportAnnotations: convertToRaw(changesEditorState.getCurrentContent())
      });

    db.collection('mails').add({
      to: infoStudent.email,
      template: {
        name: 'ReportFailed',
        data: {
          from_name: infoStudent.name,
          reason: draftToHtml(
            convertToRaw(changesEditorState.getCurrentContent())
          ),
          rechazado_por: user.displayName
        }
      }
    });

    db.collection('users')
      .doc(studentId)
      .update({
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.reportNeedChanges,
          time: serverTimestamp()
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
          reason: evaluateComment ? evaluateComment : 'Sin observaciones',
          aprovado_por: user.displayName
        }
      }
    });

    db.collection('users')
      .doc(studentId)
      .update({
        step: 0,
        [`notifications.${Date.now().toString()}`]: {
          id: Date.now().toString(),
          type: StudentNotificationTypes.finishedInternship,
          time: serverTimestamp()
        }
      });
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
            Evaluación de informe de práctica
          </Typography>
        </Grid>

        {infoStudent && (
          <Container style={{ marginTop: '2rem' }}>
            <Grid container direction='row' justifyContent='space-around'>
              <Grid item>
                <Grid
                  container
                  direction='column'
                  spacing={3}
                  justifyContent='space-evenly'>
                  <Typography variant='h5'>
                    Información del estudiante
                  </Typography>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      fullWidth
                      id='outlined-basic'
                      label='Nombre'
                      variant='outlined'
                      value={infoStudent.name}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      fullWidth
                      id='outlined-basic'
                      label='Matricula'
                      variant='outlined'
                      value={infoStudent.enrollmentNumber}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: '2rem' }}>
                    <TextField
                      fullWidth
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
                          <DownloadButton />
                        </Container>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container align='center' justifyContent='center'>
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
              justifyContent='flex-end'
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
          maxWidth='md'
          fullWidth>
          <DialogTitle>Solicitar cambios</DialogTitle>
          <DialogContent>
            <Editor
              editorState={changesEditorState}
              onEditorStateChange={setChangesEditorState}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'list',
                  'textAlign',
                  'link',
                  'emoji'
                ]
              }}
              editorStyle={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                minHeight: '16rem',
                padding: '1rem'
              }}
              toolbarStyle={{
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
              wrapperStyle={{
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                height: 'auto'
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={() => SetShowChanges(false)}>
              Cancelar
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={() => (
                handleChanges(),
                SetShowChanges(false),
                navigate('/internship-assessment')
              )}>
              Notificar cambios
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={showEvaluate}
        onClose={() => SetShowEvaluate(false)}
        fullWidth>
        <DialogTitle>Evaluar Práctica</DialogTitle>
        <DialogContent>
          <Grid container justifyContent='center' alignContent='center'>
            <Grid item>
              <Typography variant='h2'>
                {value < 20
                  ? '😰'
                  : value < 30
                  ? '😢'
                  : value < 35
                  ? '🙁'
                  : value < 40
                  ? '😬'
                  : value < 50
                  ? '😐'
                  : value < 60
                  ? '🙂'
                  : value < 65
                  ? '😃'
                  : value >= 65
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
            label='Comentarios'
            multiline
            variant='outlined'
            rows={4}
            onChange={(e) => setEvaluateComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={() => SetShowEvaluate(false)}>
            Cancelar
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={() => (
              handleEvaluate(),
              SetShowEvaluate(false),
              navigate('/internship-assessment')
            )}>
            Confirmar Evaluación
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssessReport;
