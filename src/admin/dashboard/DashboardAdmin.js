import {
  Heading,
  Text,
  Main,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from 'grommet';
import React from 'react';
import QuickAccess from './QuickAccess';
import {
  List,
  Group,
  Task,
  Upload,
  DocumentText,
  LinkNext
} from 'grommet-icons';
import { Link, Route, Switch } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import Application from '../applications/Application';

function DashboardAdmin() {
  return (
    <Switch>
      <Route exact path='/'>
        <Main pad='xlarge'>
          <Heading>¡Hola, Usuario Admin!</Heading>
          <Box alignSelf='center' direction='row-responsive'>
            <Box pad='small'>
              <Card height='small' width='small' background='light-1'>
                <CardHeader pad='medium'>Solicitudes pendientes</CardHeader>
                <CardBody align='center' pad='medium'>
                  <Text weight='bold'>10</Text>
                </CardBody>
                <CardFooter pad={{ horizontal: 'small' }} background='light-2'>
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
    </Switch>
  );
}

export default DashboardAdmin;
