
import { Main, Heading, Card, Grid, Box, Form, TextInput, Button, FormField, ResponsiveContext, Grommet } from 'grommet';
import React, { useState } from "react";
import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes";
import firebase from "firebase/app";
import "firebase/auth";


const customBreakpoints = deepMerge(grommet, {
  global: {
    breakpoints: {
      small: {
        value: 1000
      },
      medium: {
        value: 1000
      },
      large: 3000
    },
    colors: {
      focus: '#000000' // added focus color
    }
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
  const [error, setError] = useState(null);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    try {
      firebase.auth().signInWithEmailAndPassword(email, password);
      const token = firebase.auth().currentUser.getIdTokenResult();
      console.log("Successfully logged user!");
      console.log(token);
    }
    catch(err) {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
      
    }
  }

  return (
    <div
      style={{ height: '100vh' }}
      path="100%"
    >
      
      <Main
        align='left'
        full={true}
        background="url('Fondo.png')"
      >
        <Grommet
          
          background='False'
          theme={customBreakpoints}>
          <Box>
     
            <ResponsiveGrid
              rows={rows}
              columns={columns}
              gap="small"
              areas={areas}
              margin="medium"
            >
              <Box
                gridArea="header"
                justify="center"
                align="center"
              >
                <Heading align='rigth' margin="small" level='1' label='Gestion de Practicas'>Gestión de Prácticas</Heading>
                <Heading align='rigth' margin="small" level='2' label='Utalca'>Utalca</Heading>
              </Box>
              <Box
                gridArea="test"
                justify="center"
                align="center"
              >
              </Box>
              <Box
                gridArea="test1"
                justify="center"
                align="center"
              >
                <Card height="250px" width="500px"
                  background={
                    { opacity: 'strong', color: 'light-1' }
                  }
                >
                  <Form>

                    <FormField margin="small" name="email" htmlFor="text-input-id" label="Email">
                      <TextInput id="text-input-email" name="Email" onChange={(event) => { setEmail(event.currentTarget.value) }} />
                    </FormField>
                    <FormField margin="small" name="Contraseña" htmlFor="text-input-id" label="Contraseña">
                      <TextInput id="text-input-password" name="Contraseña" type="password" onChange={(event) => { setPassword(event.currentTarget.value) }} />
                    </FormField>
                    <Button style={{ marginLeft: '35%' }} type="Submit" primary label="Ingresar" aling='center' color='#f4971a' onClick={(event) => signInWithEmailAndPasswordHandler(event, email, password)} />
                  </Form>
                </Card>
              </Box>
            </ResponsiveGrid>
            <ResponsiveGrid
              gap="small"
              margin="medium"
              columns="medium"
              rows="xsmall"
            ></ResponsiveGrid>
          </Box>
        </Grommet>
      </Main>
    </div>
  );
}

export default Landing;
