import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Grommet } from 'grommet';
import { MenuButton } from '.';

export class Sidebar extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const { items = [], ...rest } = this.props;
    return (
      <Grommet>
        <Box fill='vertical' width='sidebar' elevation='medium' {...rest}>
          <Box
            gridArea='sidebar'
            background='rgb(40,118,134)'
            width='small'
            animation={[
              { type: 'fadeIn', duration: 300 },
              { type: 'slideRight', size: 'xlarge', duration: 150 }
            ]}
            flex>
            {items.map(({ active, Icon, label, path }) => (
              <MenuButton
                active={active}
                Icon={Icon}
                path={path}
                label={label}
                key={label}
              />
            ))}
          </Box>
        </Box>
      </Grommet>
    );
  }
}
