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
  Chart
} from 'grommet';
import React, { useEffect, useState } from 'react';
import useAuth from '../../providers/Auth';
import { Link, Route, Switch } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../layout/BarraLateral';
import Application from '../applications/Application';
import { LinkNext, Halt } from 'grommet-icons';

import { db } from '../../firebase';

function DashboardAdmin({ sidebarProps }) {
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
      <BarraLateral {...sidebarProps} />
      <Box flex>
        <Switch>
          <Route exact path='/'>
            <Main pad='xlarge'>
              <Heading> ¡Hola, {userData && userData.name}!</Heading>
              <Box alignSelf='center'>
                <Box margin='medium' pad='small'>
                  <Card background='light-1'>
                    <CardHeader pad='medium'>Solicitudes pendientes</CardHeader>
                    <CardBody align='center' pad='medium'>
                      {pendingApplications && (
                        <Text weight='bold'>{pendingApplications.length}</Text>
                      )}
                    </CardBody>
                    <CardFooter justify='end' background='light-2'>
                      <Link to='/applications'>
                        <Button
                          fill='horizontal'
                          icon={<LinkNext color='plain' />}
                          hoverIndicator
                        />
                      </Link>
                    </CardFooter>
                  </Card>
                </Box>
                <Box direction='row-responsive'>
                  <Card background='light-1' margin='medium' pad='medium'>
                    <CardHeader>
                      Gráfico: Por qué Paw Patrol es mejor que el resto
                    </CardHeader>
                    <CardBody>
                      <Chart
                        animate
                        bounds={[
                          [0, 7],
                          [0, 100]
                        ]}
                        values={[
                          { value: [0, 100], label: 'zero' },
                          { value: [1, 10], label: 'thirty' },
                          { value: [2, 15], label: 'forty' },
                          { value: [3, 12], label: 'sixty' },
                          { value: [4, 8], label: 'seventy' },
                          { value: [5, 4], label: 'sixty' }
                        ]}
                        aria-label='chart'
                      />
                    </CardBody>
                  </Card>
                  <Card background='light-1' margin='medium' pad='medium'>
                    <CardHeader>Gráfico: Revenue OnlyFans del poio</CardHeader>
                    <CardBody>
                      <Chart
                        animate
                        bounds={[
                          [0, 7],
                          [0, 100]
                        ]}
                        values={[
                          { value: [0, 5], label: 'zero' },
                          { value: [1, 30], label: 'thirty' },
                          { value: [2, 40], label: 'forty' },
                          { value: [3, 60], label: 'sixty' },
                          { value: [4, 70], label: 'seventy' },
                          { value: [5, 60], label: 'sixty' },
                          { value: [6, 80], label: 'eighty' },
                          { value: [7, 100], label: 'one hundred' }
                        ]}
                        aria-label='chart'
                      />
                    </CardBody>
                  </Card>
                </Box>
              </Box>
            </Main>
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
