import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import useAuth from '../../providers/Auth';
import Documentos from './extras/Documentos';
import Practicas from './extras/Practicas';
import Formulario from '../../form/Formulario';
import { db, storage } from '../../firebase';
import { Route, Switch } from 'react-router-dom';
import StudentApplications from './applications/StudentApplications';
import ApplicationDetails from './applications/ApplicationDetails';
import EmptyHome from './EmptyHome';
import DetailedHome from './DetailedHome';
import Hidden from '@material-ui/core/Hidden';

function DashboardEstudiante(props) {
  const { user, userData } = useAuth();
  const [careerInternshipInfo, setCareerInternshipInfo] = useState();
  const [docs, setDocs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [practicas, setPracticas] = useState([]);

  useEffect(() => {
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

      db.collection('internships')
        .where('studentId', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          const temp = [];
          querySnapshot.forEach((doc) =>
            temp.push({ id: doc.id, ...doc.data() })
          );
          setPracticas(temp);
          setLoaded(true);
        });
    }
  }, [user, userData]);

  return (
    <Switch>
      <Route exact path='/'>
        {/*<Box pad='xlarge'>
          {loaded ? (
            <>
              <Heading margin='small'>
                ¡Hola, {userData && userData.name}!
              </Heading>
              <Markdown margin='small'>
                {careerInternshipInfo &&
                  careerInternshipInfo.info.replaceAll('\\n', '\n')}
              </Markdown>
              <Accordion margin='small'>
                <AccordionPanel label='Documentos'>
                  <Documentos docs={docs} />
                </AccordionPanel>
                <AccordionPanel label='Prácticas'>
                  <Practicas practicas={practicas} />
                </AccordionPanel>
              </Accordion>
            </>
          ) : (
            <Box align='center'>
              <Spinner margin='medium' size='large' />
            </Box>
          )}
        </Box>*/}
        <Hidden smDown>
          <div className='p-5 text-center bg-image banner' style={{ backgroundImage: "url('HomeBanner-2x.png')"}}>
              <div className='mask'>
                  <div className='d-flex align-items-center h-100'>
                      <div className='text-black'>
                          <Typography variant='h4' style={{marginLeft: '2rem'}}>¡Bienvenido, {userData && userData.name}!</Typography>
                      </div>
                  </div>
              </div>
          </div>
        </Hidden>
        {props.onGoingIntern  ? <DetailedHome done={false}/> : <EmptyHome practicas={practicas}/> }
      </Route>
      <Route path='/form/:userId/:internshipId'>
        <Formulario />
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
