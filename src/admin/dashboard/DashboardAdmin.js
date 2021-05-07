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
  Paragraph
} from 'grommet';
import React, { useEffect, useState } from 'react';
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

function DashboardAdmin() {
  const { user, userData } = useAuth();
  return (
    <Box direction='row' fill responsive>
      <BarraLateral />
      <Box flex>
        <Switch>
          <Route exact path='/'>
            <Main pad='xlarge'>
              <Heading> ¡Hola, {userData && userData.name}!</Heading>
              <Box alignSelf='center' direction='row-responsive'>
                <Box pad='small'>
                  <Card height='small' width='small' background='light-1'>
                    <CardHeader pad='medium'>Solicitudes pendientes</CardHeader>
                    <CardBody align='center' pad='medium'>
                      <Text weight='bold'>10</Text>
                    </CardBody>
                    <CardFooter
                      pad={{ horizontal: 'small' }}
                      background='light-2'>
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
                <Box pad='small'>
                  <QuickAccess
                    title='Inscripciones Aprobadas'
                    body={<List color='plain' />}
                  />
                </Box>
                <Box pad='small'>
                  <QuickAccess
                    title='Administrar Encargados'
                    body={<Group color='plain' />}
                  />
                </Box>
              </Box>
              <Box alignSelf='center' direction='row-responsive'>
                <Box pad='small'>
                  <QuickAccess
                    title='Evaluar Prácticas'
                    body={<Task color='plain' />}
                  />
                </Box>
                <Box pad='small'>
                  <QuickAccess
                    title='Importar Alumnos'
                    body={<Upload color='plain' />}
                  />
                </Box>
                <Box pad='small'>
                  <QuickAccess
                    title='Editar Formulario'
                    body={<DocumentText color='plain' />}
                  />
                </Box>
              </Box>
            </Main>
          </Route>
          <Route exact path='/applications'>
            <ApplicationsList />
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
