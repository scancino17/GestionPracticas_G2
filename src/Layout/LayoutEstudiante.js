import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Box, Grommet, Button, Nav, Header } from 'grommet';
import { Dashboard, Link, User, Menu, Logout } from 'grommet-icons';
import { Sidebar } from './components';
import { NotFound, MiPerfil, Link_2, Link_3 } from './paginasDePrueba';
import Estudiante from '../dashboard-estudiante/Estudiante';
import firebase from 'firebase/app';

const items = [
  {
    label: 'DashBoard',
    Icon: Dashboard,
    path: '/Estudiante'
  },

  {
    label: 'Mi perfil',
    Icon: User,
    path: '/Link_1'
  },
  {
    label: 'Link 2',
    Icon: Link,
    path: '/Link_2'
  },
  {
    label: 'Link 3',
    Icon: Link,
    path: '/Link_3'
  }
];

class LayoutEstudiante extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abrir: false
    };
  }

  render() {
    return (
      <Router>
        <Grommet full>
          <Header background='rgb(55,163,184)' pad='small'>
            <Nav>
              <Button
                onClick={() => this.setState({ abrir: !this.state.abrir })}>
                <Menu color='white' />
              </Button>
            </Nav>
            <Button
              onClick={(event) => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    console.log('Sign-out successful.');
                  })
                  .catch((error) => {
                    console.log('An error happened.');
                  });
              }}>
              <Logout color='white' />
            </Button>
          </Header>
          <Box direction='row' fill>
            {this.state.abrir && (
              <Sidebar
                appIcon={<Dashboard />}
                appName='DashBoard'
                items={items}
              />
            )}
            <Box flex>
              <Switch>
                <Route path='/Estudiante' exact component={Estudiante} />
                <Route path='/Link_1' component={MiPerfil} />
                <Route path='/Link_2' component={Link_2} />
                <Route component={NotFound} />
              </Switch>
            </Box>
          </Box>
        </Grommet>
      </Router>
    );
  }
}

export default LayoutEstudiante;
