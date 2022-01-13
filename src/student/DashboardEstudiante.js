import React, { useEffect, useState } from 'react';
import useAuth from '../providers/Auth';
import { db } from '../firebase';
import { Route, Routes } from 'react-router-dom';
import DetailedHome from './DetailedHome';
import { Grid, Hidden, Typography, Card, Container } from '@material-ui/core';
import CustomStepper from './extras/CustomStepper';
import StudentApplications from './applications/StudentApplications';
import ApplicationDetails from './applications/ApplicationDetails';
import InternshipIntention from './InternshipIntention';
import { finishedIntentionProcess } from '../InternshipStates';
import SendForm from './../dynamicForm/SendForm';
import { Skeleton } from '@material-ui/lab';

function DashboardEstudiante() {
  const { user, userData } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [practicas, setPracticas] = useState([]);
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (userData) {
      if (userData.step) setStep(userData.step);
      unsubscribe = db
        .collection('internships')
        .where('studentId', '==', user.uid)
        .onSnapshot((querySnapshot) => {
          const temp = [];
          querySnapshot.forEach((doc) =>
            temp.push({ id: doc.id, ...doc.data() })
          );
          temp.sort((a, b) =>
            a.internshipNumber > b.internshipNumber ? 1 : -1
          );
          setPracticas(temp);
          setLoaded(true);
        });
      if (
        userData.currentInternship &&
        userData.currentInternship.lastApplication
      ) {
        db.collection('applications')
          .doc(userData.currentInternship.lastApplication)
          .get()
          .then((last) => {
            setReason(last.data().reason);
          });
      }
    }
    return unsubscribe;
  }, [user, userData]);

  return (
    <Routes>
      <Route exact path='/'
        element={loaded ? (
          <>
            <Hidden smDown>
              <Grid
                style={{
                  backgroundImage: "url('HomeBanner-3x.png')",
                  backgroundColor: '#e0f3f7',
                  backgroundSize: '100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  padding: '2rem'
                }}>
                <Typography variant='h4'>
                  ¡Bienvenido/a, {userData && userData.name}!
                </Typography>
                {userData.step > 0 && (
                  <Typography variant='h5'>
                    Práctica {userData.currentInternship.number}{' '}
                    {userData.step > 1 &&
                      `· ${userData.currentInternship.Empresa}`}
                  </Typography>
                )}
              </Grid>
            </Hidden>
            <Container style={{ padding: '2rem' }}>
              <Card>
                <CustomStepper step={step} />
              </Card>
            </Container>
            {practicas.filter((item) => !finishedIntentionProcess(item.status))
              .length > 0 ? (
              <DetailedHome done={false} reason={reason} />
            ) : (
              <InternshipIntention internships={practicas} />
            )}
          </>
        ) : (
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            direction='column'
            style={{ marginTop: '4rem' }}>
            <Skeleton
              variant='rect'
              animation='wave'
              height='5rem'
              width='75%'
              style={{ marginBottom: '2rem' }}
            />
            <Skeleton animation='wave' width='75%' height='2rem' />
            <Skeleton animation='wave' width='75%' height='2rem' />
            <Skeleton animation='wave' width='75%' height='2rem' />
          </Grid>
        )}
      />
      {/**este es el que va al formulario dinamico */}
      <Route path='/send-form'
        element={<SendForm />}
      />
      {/**este es el que va al formulario dinamico para edicion */}
      <Route path='/edit-form/:applicationId'
       element={ <SendForm edit />}
      />

      <Route path='/internship/:studentId/:internshipId'
        element={<StudentApplications />}
      />
      <Route path='/applications/:applicationId'
        element={<ApplicationDetails />}
      />
    </Routes>
  );
}

export default DashboardEstudiante;
