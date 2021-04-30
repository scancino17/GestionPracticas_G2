import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import { Box, Text } from 'grommet';
import RoutedButton from './RoutedButton';
import img from '../Logo_CDP.png';
import { MenuButton } from '.';

export class Sidebar extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const { appIcon, appName, items = [], ...rest } = this.props;
    const { router } = this.context;
    return (
      <Box
        fill='vertical'
        width='sidebar'
        background='rgb(55,163,184)'
        elevation='medium'
        {...rest}>
        <img src={img} width='100px' height='60px' />
        <RoutedButton
          path='/'
          hoverIndicator='rgb(40,118,134)'
          active={
            router &&
            !!matchPath(router.route.location.pathname, {
              path: '/',
              exact: true
            })
          }>
          <Box
            flex={false}
            align='center'
            gap='xsmall'
            pad={{ vertical: 'small' }}>
            {appIcon}
            <Text color='White' size='xsmall'>
              {appName}
            </Text>
          </Box>
        </RoutedButton>
        <Box flex overflow='auto'>
          {items.map(({ active, Icon, label, path }) => (
            <MenuButton
              color='white'
              active={active}
              Icon={Icon}
              path={path}
              label={label}
              key={label}
            />
          ))}
        </Box>
      </Box>
    );
  }
}
