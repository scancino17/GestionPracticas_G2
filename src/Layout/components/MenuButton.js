import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import { Box, Text } from 'grommet';
import RoutedButton from './RoutedButton';

export class MenuButton extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
  render() {
    const { active, Icon, label, path, ...rest } = this.props;
    const { router } = this.context;
    return (
      <RoutedButton
        active={
          active ||
          (router && !!matchPath(router.route.location.pathname, { path }))
        }
        hoverIndicator='rgb(30,86,96)'
        path={path}
        {...rest}>
        <Box
          pad={{ vertical: 'small' }}
          gap='xsmall'
          align='center'
          justify='center'>
          <Icon color='light-5' />
          <Text size='xsmall' color='white'>
            {label}
          </Text>
        </Box>
      </RoutedButton>
    );
  }
}
