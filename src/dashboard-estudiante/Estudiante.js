import { Accordion, Card, Col, Container, Row } from 'react-bootstrap'
import { BsFillCaretDownFill } from "react-icons/bs";
import Documento from './extras/Documento'
import Practica from './extras/Practica'
import React from 'react'
import axios from 'axios'

class Estudiante extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      documentos: [],
      practicas: [],
      user: []
    }
  }

  getDocumentos(){
    axios.get('http://jsonplaceholder.typicode.com/users').then(res => {
      var data = res.data
        this.setState({documentos : data})
    })
  }

  getPracticas(){
    axios.get('http://jsonplaceholder.typicode.com/users').then(res => {
      var data = res.data
        this.setState({practicas : data})
    })
  }

  getUser(){
    axios.get('http://jsonplaceholder.typicode.com/users/1').then(res => {
      var data = res.data
        this.setState({user : data})
    })
  }

  componentDidMount(){
    this.getUser()
    this.getDocumentos()
    this.getPracticas()
  }

  render(){
    return (
      <div className="m-2">
        <h3>Hola! {this.state.user.name}</h3>
        <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit dui, fringilla facilisis at montes suscipit rhoncus ultrices, cursus augue primis auctor cum tortor litora. Ligula scelerisque orci himenaeos blandit sagittis curabitur quam, mauris primis phasellus natoque dapibus tempus, ac potenti augue egestas torquent laoreet.
        </p>
        <Accordion>
          <React.StrictMode>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  <Container>
                    <Row>
                      <Col className="pull-xs-right" xs={10}>Documentos</Col>
                      <Col className="pull-xs-left" xs={2}><BsFillCaretDownFill/></Col>
                    </Row>
                  </Container>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Documento docs={this.state.documentos}/>
                  </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  <Container>
                    <Row>
                      <Col className="pull-xs-right" xs={10}>Prácticas</Col>
                      <Col className="pull-xs-left" xs={2}><BsFillCaretDownFill/></Col>
                    </Row>
                  </Container>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <Practica practicas={this.state.practicas}/>
                  </Card.Body>
                </Accordion.Collapse>
            </Card>
            </React.StrictMode>
        </Accordion>
      </div>
    );
  }
}

export default Estudiante