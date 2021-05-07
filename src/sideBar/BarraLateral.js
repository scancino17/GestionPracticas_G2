import { Sidebar, Nav, Button, ResponsiveContext, Text } from 'grommet';
import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

function BarraLateral(props) {
  const size = React.useContext(ResponsiveContext);

  return (
    <>
      {size !== 'small' && (
        <Sidebar
          background='#02475e'
          round='none'
          align='15px'
          justify='start'
          width='10rem'>
          {props.items.map((item) => (
            <Text>{item.label}</Text>
          ))}
          <Link to='/applications'>
            <button type='button'>Click Me!</button>
          </Link>
        </Sidebar>
      )}
    </>
  );
}
export default BarraLateral;
