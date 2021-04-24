import Documento from './extras/Documento';
import Practica from './extras/Practica';
import React from 'react';
import axios from 'axios';
import { Accordion, AccordionPanel, Text, Box, Heading } from 'grommet';
import firebase from 'firebase/app';

class Estudiante extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentos: [],
      practicas: [],
      user: []
    };
  }

  getDocumentos() {
    axios.get('https://rickandmortyapi.com/api/character').then((res) => {
      var data = res.data;
      this.setState({ documentos: data });
    });
  }

  getPracticas() {
    axios.get('https://rickandmortyapi.com/api/character').then((res) => {
      var data = res.data;
      this.setState({ practicas: data });
    });
  }

  getUser() {
    axios.get('https://rickandmortyapi.com/api/character/1').then((res) => {
      var data = res.data;
      this.setState({ user: data });
    });
  }

  componentDidMount() {
    this.getUser();
    this.getDocumentos();
    this.getPracticas();
  }

  render() {
    return (
      <Accordion>
        <Heading margin='none'>Hola! {this.state.user.name}</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipiscing elit dui, fringilla
          facilisis at montes suscipit rhoncus ultrices, cursus augue primis
          auctor cum tortor litora. Ligula scelerisque orci himenaeos blandit
          sagittis curabitur quam, mauris primis phasellus natoque dapibus
          tempus, ac potenti augue egestas torquent laoreet.
        </Text>
        <br />
        <AccordionPanel label='Documentos'>
          <Box pad='medium' background='light-2'>
            <Documento docs={this.state.documentos.results} />
          </Box>
        </AccordionPanel>
        <AccordionPanel label='Prácticas'>
          <Box pad='medium' background='light-2'>
            <Practica practicas={this.state.practicas.results} />
          </Box>
        </AccordionPanel>
        <button
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
          Sign Out
        </button>
      </Accordion>
    );
  }
}

export default Estudiante;
