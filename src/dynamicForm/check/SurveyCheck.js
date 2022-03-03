import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  Fab
} from '@material-ui/core';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { CheckOutlined } from '@material-ui/icons';
import FormView from '../builder_preview/FormView';
import { useNavigate } from 'react-router-dom';
import { useSupervisor } from '../../providers/Supervisor';
import { serverTimestamp } from 'firebase/firestore';

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
  fab: {
    position: 'fixed',
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function SurveyCheck() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState([]);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);

  const { getForm, setForm } = useSupervisor();
  const classes = useStyles();

  useEffect(() => {
    getForm('send-survey', surveyId).then((surveyForm) => {
      setSurvey(surveyForm);
    });
  }, [surveyId, getForm]);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleMarkAsRead() {
    Swal.fire({
      title: '¿Desea marcar como leido?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Se marco como leido!', '', 'success').then(
          // marcar como leido en la base de datos
          setForm(
            'send-survey',
            surveyId,
            { read: true, revisionTime: serverTimestamp() },
            { merge: true }
          ),
          navigate('/satisfaction-survey/')
        );
      }
    });
  }
  return (
    <>
      <Fab
        variant='extended'
        color='primary'
        onClick={() => handleMarkAsRead()}
        className={classes.fab}>
        <CheckOutlined />
        Marcar como leido
      </Fab>

      <Grid container direction='column'>
        <Grid
          style={{
            backgroundImage: "url('../AdminBanner-Form.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '2rem'
          }}>
          <Typography variant='h4'>Revisión de encuesta</Typography>
        </Grid>
        <Container style={{ paddingBottom: '5rem' }}>
          {survey &&
            survey.map((step) => (
              <Grid item>
                <Typography variant='h4' style={{ margin: '3rem 0 2rem 0' }}>
                  {step.step}
                </Typography>
                <FormView
                  readOnly
                  studentId={survey.studentId}
                  internshipId={survey.internshipId}
                  applicationId={surveyId}
                  form={step.form}
                  flag={flag}
                  setFlag={setFlag}
                  admin
                />
              </Grid>
            ))}
        </Container>
      </Grid>
    </>
  );
}

export default SurveyCheck;
