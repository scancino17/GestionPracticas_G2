import React, { useState } from "react";
import { Main, Heading, Card, Grid, Box, Form, TextInput, Button, FormField, ResponsiveContext, Grommet } from 'grommet';
import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes";
import firebase from "firebase/app";
import "firebase/auth";


const customBreakpoints = deepMerge(grommet, {
  global: {
    breakpoints: {
      small: { value: 1000 },
      medium: { value: 1000 },
      large: { value: 30000 }
    },
    colors: { focus: '#000000' }
  }
});

const columns = {
  small: ["auto"],
  medium: ["auto"],
  large: ["large", "xflex", "large"],
  xlarge: ["large", "flex", "large"]
};

const rows = {
  small: ["xsmall", "xsmall", "flex", "medium"],
  medium: ["xsmall", "xsmall", "flex", "medium"],
  large: ["small", "medium"],
  xlarge: ["small", "medium"]
};


const areas = {
  small: [
    { name: "header", start: [0, 1], end: [0, 1] },
    { name: "test", start: [0, 2], end: [0, 2] },
    { name: "test1", start: [0, 3], end: [0, 3] }
  ],
  medium: [
    { name: "header", start: [0, 1], end: [0, 1] },
    { name: "test", start: [0, 2], end: [0, 2] },
    { name: "test1", start: [0, 3], end: [0, 3] }
  ],
  large: [
    { name: "header", start: [0, 1], end: [0, 1] },
    { name: "test", start: [1, 1], end: [1, 1] },
    { name: "test1", start: [2, 1], end: [2, 1] }
  ],
  xlarge: [
    { name: "header", start: [0, 0], end: [0, 0] },
    { name: "test", start: [1, 0], end: [1, 0] },
    { name: "test1", start: [2, 0], end: [2, 0] }
  ]
};

const ResponsiveGrid = ({
  children,
  overrideColumns,
  overrideRows,
  areas,
  ...props
}) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      let columnsVal = columns;
      if (columns) {
        if (columns[size]) {
          columnsVal = columns[size];
        }
      }

      let rowsVal = rows;
      if (rows) {
        if (rows[size]) {
          rowsVal = rows[size];
        }
      }

      let areasVal = areas;
      if (areas && !Array.isArray(areas)) areasVal = areas[size];

      return (
        <Grid
          fill='True'
          {...props}

          areas={!areasVal ? undefined : areasVal}
          rows={!rowsVal ? size : rowsVal}
          columns={!columnsVal ? size : columnsVal}
        >
          {children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);

function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
      console.log("Sucessfully logged user!", userCredential.user);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  return (
    <Main align='left' full={true} background="url('Fondo.png')" style={{ height: '100vh' }} path="100%">
      <Grommet background='False' theme={customBreakpoints}>
        <Box>
          <ResponsiveGrid rows={rows} columns={columns} gap="small" areas={areas} margin="medium">
            <Box gridArea="header" justify="center" align="center">
              <Heading margin="small" level='1'>Gestión de Prácticas</Heading>
              <Heading margin="small" level='2'>Universidad de Talca</Heading>
            </Box>
            <Box gridArea="test1" justify="center" align="center">
              <Card height="250px" width="500px" background={{ opacity: 'strong', color: 'light-1' }}>
                <Form onSubmit={(event) => signInWithEmailAndPasswordHandler(event, email, password)}>
                  <FormField margin="small" name="email" htmlFor="text-input-email" label="Email" required="true">
                    <TextInput id="text-input-email" name="email" type="email" onChange={(event) => { setEmail(event.currentTarget.value) }} />
                  </FormField>
                  <FormField margin="small" name="password" htmlFor="text-input-password" label="Contraseña" required="true">
                    <TextInput id="text-input-password" name="password" type="password" onChange={(event) => { setPassword(event.currentTarget.value) }} />
                  </FormField>
                  <Box align="center">
                    <Button type="submit" primary label="Ingresar" color='#f4971a' />
                  </Box>
                </Form>
              </Card>
            </Box>
          </ResponsiveGrid>
          <ResponsiveGrid gap="small" margin="medium" columns="medium" rows="xsmall" />
        </Box>
      </Grommet>
    </Main>
  );
}

export default Landing;
