import React, { Component } from 'react';
import { deepMerge } from 'grommet/utils';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Box, Grommet } from 'grommet';
import { Dashboard, Link, User } from 'grommet-icons';

import { Sidebar } from './extra/components';
import { NotFound, MiPerfil, Link_2, Link_3 } from './pages';
import Estudiante from '../dashboard-estudiante/Estudiante';

const theme = deepMerge(Grommet, {
  global: {
    colors: {
      active: 'white'
    },

    elevation: {
      light: {
        small: '0 0 1px 0 rgb(26,74,85), 0 1px 2px 0 rgb(26,74,85)',
        medium: '0 0 2px 0 rgb(26,74,85), 0 2px 4px 0 rgb(26,74,85)',
        large: '0 0 1px 0 rgb(26,74,85), 0 4px 8px 0 rgb(26,74,85)',
        xlarge: '0 0 1px 0 rgb(26,74,85), 0 8px 16px 0 rgb(26,74,85)'
      }
    },
    size: {
      sidebar: '100px'
    }
  }
});

const items = [
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
  render() {
    return (
      <Router>
        <Grommet theme={theme} full>
          <Box direction='row' fill>
            <Sidebar
              appIcon={<Dashboard />}
              appName='DashBoard'
              items={items}
            />
            <Box flex>
              <Switch>
                <Route path='/' exact component={Estudiante} />
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
