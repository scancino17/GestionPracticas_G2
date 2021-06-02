import React, { useEffect, useState } from 'react';
import useAuth from '../../providers/Auth';
import { db, storage } from '../../firebase';
import { Route, Switch } from 'react-router-dom';
import EmptyHome from './EmptyHome';
import DetailedHome from './DetailedHome';
import {
  CircularProgress,
  Grid,
  Hidden,
  Typography,
  Divider,
  Card,
  Container
} from '@material-ui/core';
import CustomStepper from './extras/CustomStepper';
import StudentApplications from './applications/StudentApplications';
import ApplicationDetails from './applications/ApplicationDetails';
import Formulario from './../../form/Formulario';
import InternshipIntention from './InternshipIntention';
import { finishedIntentionProcess } from '../../InternshipStates';
import SendForm from './../../dynamicForm/SendForm';

function DashboardEstudiante(props) {
  const { user, userData } = useAuth();
  const [careerInternshipInfo, setCareerInternshipInfo] = useState();
  const [docs, setDocs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [practicas, setPracticas] = useState([]);

  useEffect(() => {
    let desubscribe = () => {};
    if (userData) {
      db.collection('careerInternshipInfo')
        .where('careerId', '==', userData.careerId)
        .get()
        .then((querySnapshot) =>
          setCareerInternshipInfo(querySnapshot.docs[0].data())
        );

      storage
        .ref(`careers-docs/${userData.careerId}`)
        .listAll()
        .then((res) => setDocs(res.items));

      desubscribe = db
        .collection('internships')
        .where('studentId', '==', user.uid)
        .onSnapshot((querySnapshot) => {
          const temp = [];
          querySnapshot.forEach((doc) =>
            temp.push({ id: doc.id, ...doc.data() })
          );
          setPracticas(temp);
          setLoaded(true);
        });
    }

    return desubscribe;
  }, [user, userData]);

  return (
    <Switch>
      <Route exact path='/'>
        {loaded ? (
          <>
            <Hidden smDown>
              <Grid
                style={{
                  backgroundImage: "url('HomeBanner-2x.png')",
                  backgroundSize: 'cover'
                }}>
                <Typography variant='h4' style={{ padding: '2rem' }}>
                  ¡Bienvenido/a, {userData && userData.name}!
                </Typography>
              </Grid>
            </Hidden>
            <Container style={{ padding: '2rem' }}>
              <Card>
                <Grid item>
                  <Grid item>
                    <CustomStepper />
                  </Grid>
                  <Divider />
                  <Grid item style={{ margin: '2rem 0rem 1rem 2rem' }}>
                    <Typography variant='h5'>Práctica X: Google</Typography>
                    <Hidden smDown>
                      <Typography color='textSecondary' variant='body2'>
                        Supervisor: Sundar Pichai · Dirección: Palo Alto, CA ·
                        Modalidad: Remoto
                      </Typography>
                    </Hidden>
                  </Grid>
                </Grid>
              </Card>
            </Container>
            {practicas.filter((item) => !finishedIntentionProcess(item.status))
              .length > 0 ? (
              <DetailedHome done={false} />
            ) : (
              <InternshipIntention internships={practicas} />
            )}
          </>
        ) : (
          <Grid item container justify='center' alignItems='center' xs={12}>
            <CircularProgress color='secondary' />
          </Grid>
        )}
      </Route>
      <Route path='/form/:userId/:internshipId'>
        <Formulario />
      </Route>
      {/**este es el que va al formulario dinamico */}
      <Route path='/send-form'>
        <SendForm />
      </Route>
      {/**este es el que va al formulario dinamico para edicion */}
      <Route path='/editInternship/:internshipId'>
        <SendForm edit />
      </Route>
      <Route path='/internship/:studentId/:internshipId'>
        <StudentApplications />
      </Route>
      <Route path='/applications/:applicationId'>
        <ApplicationDetails />
      </Route>
    </Switch>
  );
}

export default DashboardEstudiante;
