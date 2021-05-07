import { Sidebar, Nav, Button, ResponsiveContext, Text } from 'grommet';
import React, { Component } from 'react';
import {
  List,
  Group,
  Task,
  Upload,
  DocumentText,
  Archive
} from 'grommet-icons';
import { Route, Switch, Link } from 'react-router-dom';
const items = [
  {
    label: 'Inscripción Pendiente',
    icon: <Archive style={{ color: 'inherit' }} />,
    path: '/applications'
  },
  {
    label: 'Inscripciones Aprobadas',
    icon: <List style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Administrar Encargados',
    icon: <Group style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Evaluar Prácticas',
    icon: <Task style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Importar Alumnos',
    icon: <Upload style={{ color: 'inherit' }} />,
    path: '/wip'
  },
  {
    label: 'Editar Formulario',
    icon: <DocumentText style={{ color: 'inherit' }} />,
    path: '/wip'
  }
];
function BarraLateral() {
  return (
    <>
      <Sidebar
        elevation='large'
        background='#02475e'
        round='none'
        align='15px'
        justify='start'
        width='12rem'>
        {items.map((item) => (
          <>
            <Nav gap='none'>
              <Link
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  margin: '10px 0 0 10px'
                }}
                to={item.path}>
                <Button
                  plain={true}
                  label={item.label}
                  icon={item.icon}></Button>
              </Link>
            </Nav>
          </>
        ))}
      </Sidebar>
    </>
  );
}
export default BarraLateral;
