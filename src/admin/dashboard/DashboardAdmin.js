import {
  Heading,
  Text,
  Main,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Paragraph,
  Grid,
  Chart
} from 'grommet';
import React, { useEffect, useState } from 'react';
import QuickAccessGr from './QuickAccessGr';
import QuickAccess from './QuickAccess';
import useAuth from '../../providers/Auth';
import { Link, Route, Switch } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../sideBar/BarraLateral';
import Application from '../applications/Application';
import {
  List,
  Group,
  Task,
  Upload,
  DocumentText,
  LinkNext,
  Halt
} from 'grommet-icons';

import { db } from '../../firebase';

function DashboardAdmin() {
  const { user, userData } = useAuth();
  const [applications, setApplications] = useState();
  const [pendingApplications, setPendingApplications] = useState();

  let updateApplications = () => {
    db.collection('applications').onSnapshot((querySnapshot) => {
      var list = [];
      querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setApplications(list);
      const pending = list.filter((item) => item.status === 'En revisión');
      setPendingApplications(pending);
    });
  };

  useEffect(() => {
    updateApplications();
  }, []);

  return (
    <Box direction='row' fill responsive>
      <BarraLateral />
      <Box flex>
        <Switch>
          <Route exact path='/'>
              <Box alignSelf='center'  direction='row-responsive' >
                  {pendingApplications &&(
                  <QuickAccessGr title='Solicitudes Pendientes' number={pendingApplications.length}/>
                  )}
            
                  <QuickAccessGr title='Nuevos Formularios' number={0}/>
             
                  <QuickAccessGr title='Formularios Corregidos' number={0}/>
            
                  <QuickAccessGr title='Nuevos Informes' number={10}/>
              </Box>
              <Box alignSelf='center'  direction='row-responsive'>
                  {pendingApplications &&(
                  <QuickAccess title='Solicitudes Pendientes' number={pendingApplications.length}/>
                  )}
          
                  <QuickAccess title='Nuevos Formularios' number={0}/>
            
                  <QuickAccess title='Formularios Corregidos' number={0}/>
             
                  <QuickAccess title='Nuevos Informes' number={10}/>
              </Box>   
          </Route>
          <Route exact path='/applications'>
            <ApplicationsList applications={pendingApplications} />
          </Route>
          <Route path='/applications/:id'>
            <Application />
          </Route>
          <Route exact path='/wip'>
            <Box
              fill
              align='center'
              pad={{ top: 'large', horizontal: 'small' }}>
              <Halt size='xlarge' />
              <Heading textAlign='center' level='2'>
                Pagina no encontrada!
              </Heading>
              <Paragraph textAlign='center' color='dark-4'>
                Esta pagina no existe
              </Paragraph>
            </Box>
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default DashboardAdmin;
