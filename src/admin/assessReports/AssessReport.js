import {
  Button,
  Grid,
  TextField,
  Typography,
  Slider,
  Container,
  Input,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider
} from '@material-ui/core';
import { useEffect, useState, useMemo } from 'react';
import { storage } from '../../firebase';
import { GetApp } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSupervisor } from '../../providers/Supervisor';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getDownloadURL, ref } from 'firebase/storage';
import { toLegibleDate } from '../../utils/FormatUtils';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { finishedInternship } from '../../InternshipStates';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

function AssessReport() {
  const [value, setValue] = useState(40);
  const { studentId } = useParams();
  const { internshipId } = useParams();
  const [showChanges, SetShowChanges] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [showEvaluate, SetShowEvaluate] = useState(false);
  const [changesEditorState, setChangesEditorState] = useState(
    EditorState.createEmpty()
  );
  const navigate = useNavigate();
  const [evaluateComment, setEvaluateComment] = useState('');
  const { getUserData, amendReport, evaluateReport, getInternship } =
    useSupervisor();

  const infoStudent = useMemo(() => {
    return getUserData(studentId);
  }, [getUserData, studentId]);

  function DownloadButton() {
    const [url, setUrl] = useState();

    useEffect(() => {
      setEvaluated(getInternship(internshipId).status === finishedInternship);
      getDownloadURL(
        ref(
          storage,
          `/students-docs/${studentId}/${internshipId}/reports/${internshipId}.pdf`
        )
      ).then((url) => {
        setUrl(url);
      });
    });

    return (
      <Button
        startIcon={<GetApp />}
        variant={evaluated ? 'outlined' : 'contained'}
        target='_blank'
        href={url}
        rel='noopener'>
        Ver informe
      </Button>
    );
  }

  function handleChanges() {
    amendReport(
      internshipId,
      infoStudent,
      changesEditorState.getCurrentContent()
    );
  }

  function handleEvaluate() {
    evaluateReport(internshipId, infoStudent, evaluateComment, value);
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
        {evaluated && (
          <Container style={{ marginTop: '2rem' }}>
            <Grid container direction='row' justifyContent='space-around'>
              <Grid item xs={6}>
                <Card sx={{ minWidth: 275 }}>
                  <CardHeader title={infoStudent.name}></CardHeader>
                  <Divider />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
                        <Typography variant='h6'>
                          Detalles de postulante
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Matricula:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {infoStudent.enrollmentNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Correo:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {infoStudent.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
                        <Typography variant='h6'>
                          Detalles del Evaluador
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Nombre:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {
                            getInternship(internshipId).evaluatingSupervisor
                              .name
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Correo:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {
                            getInternship(internshipId).evaluatingSupervisor
                              .email
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
                        <Typography variant='h6'>
                          Detalles de la practica
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='h4'>Nota:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='h4' component={'span'}>
                          {getInternship(internshipId).grade}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Comentarios:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {getInternship(internshipId).reason
                            ? getInternship(internshipId).reason
                            : 'Sin comentarios'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Fecha de evaluación:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography component={'span'}>
                          {' '}
                          {getInternship(internshipId).evaluatedReportTime
                            ? toLegibleDate(
                                getInternship(internshipId).evaluatedReportTime
                              )
                            : 'Sin Fecha'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <DownloadButton />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item>
                <Grid container align='center' justifyContent='center'>
                  <Grid item>
                    <img
                      height='500'
                      src='../../AdminBanner-Evaluate-Divider.png'
                      alt='Banner'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
        {infoStudent && !evaluated && (
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
                      <Grid>
                        <DownloadButton />
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
                      alt='Banner'
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
        <BootstrapDialog
          maxWidth='md'
          onClose={() => SetShowChanges(false)}
          aria-labelledby='customized-dialog-title'
          open={showChanges}>
          <BootstrapDialogTitle
            id='customized-dialog-title'
            onClose={() => SetShowChanges(false)}>
            Solicitar cambios
          </BootstrapDialogTitle>
          <DialogContent dividers>
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
              onClick={() => {
                return (
                  handleChanges(),
                  SetShowChanges(false),
                  navigate('/internship-assessment')
                );
              }}>
              Notificar cambios
            </Button>
          </DialogActions>
        </BootstrapDialog>
      )}
      <BootstrapDialog
        fullWidth
        onClose={() => SetShowEvaluate(false)}
        aria-labelledby='customized-dialog-title'
        open={showEvaluate}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={() => SetShowEvaluate(false)}>
          Evaluar Práctica
        </BootstrapDialogTitle>
        <DialogContent dividers>
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
            onClick={() => {
              return (
                handleEvaluate(),
                SetShowEvaluate(false),
                navigate('/internship-assessment')
              );
            }}>
            Confirmar Evaluación
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default AssessReport;
