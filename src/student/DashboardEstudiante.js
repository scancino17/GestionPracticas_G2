import React from 'react';
import { useStudent } from '../providers/Student';
import { Route, Routes } from 'react-router-dom';
import DetailedHome from './DetailedHome';
import { Grid, Hidden, Typography, Card, Container } from '@material-ui/core';
import CustomStepper from './extras/CustomStepper';
import StudentApplications from './applications/StudentApplications';
import ApplicationDetails from './applications/ApplicationDetails';
import InternshipIntention from './InternshipIntention';
import { finishedIntentionProcess } from '../InternshipStates';
import SendApplication from './../dynamicForm/send/SendApplication';
import SendSurvey from './../dynamicForm/send/SendSurvey';
import { Skeleton } from '@material-ui/lab';

function DashboardEstudiante() {
  const { internships, step, studentName, currentInternship, studentLoaded } =
    useStudent();

  return (
    <Routes>
      <Route
        exact
        path='/'
        element={
          studentLoaded ? (
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
                    ¡Bienvenido/a, {studentName}!
                  </Typography>
                  {step > 0 && (
                    <Typography variant='h5'>
                      Práctica {currentInternship.number}{' '}
                      {step > 1 && `· ${currentInternship.Empresa}`}
                    </Typography>
                  )}
                </Grid>
              </Hidden>
              <Container style={{ padding: '2rem' }}>
                <Card>
                  <CustomStepper step={step} />
                </Card>
              </Container>
              {internships.filter(
                (item) => !finishedIntentionProcess(item.status)
              ).length > 0 ? (
                <DetailedHome />
              ) : (
                <InternshipIntention />
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
          )
        }
      />
      {/**este es el que va al formulario dinamico */}
      <Route path='/send-form' element={<SendApplication />} />
      <Route path='/send-survey' element={<SendSurvey />} />
      {/**este es el que va al formulario dinamico para edicion */}
      <Route
        path='/edit-form/:applicationId'
        element={<SendApplication edit />}
      />

      <Route
        path='/internship/:studentId/:internshipId'
        element={<StudentApplications />}
      />
      <Route
        path='/applications/:applicationId'
        element={<ApplicationDetails />}
      />
    </Routes>
  );
}

export default DashboardEstudiante;
