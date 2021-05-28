import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  Hidden,
  Typography
} from '@material-ui/core';
import React from 'react';

import { FaChevronDown, FaWpforms } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { RiSurveyLine } from 'react-icons/ri';

function ToDoItem({ icon, title, body, buttonText }) {
  return (
    <Grid
      container
      style={{ padding: '1rem' }}
      justify='space-between'
      wrap='nowrap'>
      <Grid container>
        <Hidden smDown>
          <Grid item>{icon}</Grid>
        </Hidden>
        <Grid item>
          <Typography variant='h6'>{title}</Typography>
          <Hidden smDown>
            <Typography color='textSecondary' variant='body2'>
              {body}
            </Typography>
          </Hidden>
        </Grid>
      </Grid>
      <Grid item>
        <Button variant='outlined' color='primary'>
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
}

function ToDoList({ done }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<FaChevronDown />}
        aria-controls='panel1a-content'
        id='panel1a-header'>
        <Typography variant='h5'>Lista de Pendientes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {done ? (
          <Grid container direction='column' alignItems='center'>
            <img src='AllDone.png' alt='Vacio' />
            <Typography variant='h6'>
              No tienes tareas pendientes de momento.
            </Typography>
            <Typography color='textSecondary' variant='body2'>
              Ve, descansa. Si surje algo, te avisamos ;)
            </Typography>
          </Grid>
        ) : (
          <Grid direction='column' style={{ width: '100%' }}>
            <ToDoItem
              icon={<FiDownload className='item-responsive' />}
              title='Descargar Documentos'
              body='Descarga los documentos que tu carrera solicita adjuntar.'
              buttonText='Descargar'
            />
            <Divider />
            <ToDoItem
              icon={<FaWpforms className='item-responsive' />}
              title='Completar Formulario'
              body='Completa el formulario de inscripción de práctica.'
              buttonText='Completar'
            />
            <Divider />
            <ToDoItem
              icon={<FaWpforms className='item-responsive' />}
              title='Corregir Formulario'
              body='El formulario que enviaste requiere correcciones.'
              buttonText='Corregir'
            />
            <Divider />
            <ToDoItem
              icon={<IoDocumentAttachOutline className='item-responsive' />}
              title='Enviar Informe'
              body='Cuéntanos lo que has aprendido durante la práctica.'
              buttonText='Enviar'
            />
            <Divider />
            <ToDoItem
              icon={<IoDocumentAttachOutline className='item-responsive' />}
              title='Corregir Informe'
              body='El informe que has enviado requiere correcciones.'
              buttonText='Corregir'
            />
            <Divider />
            <ToDoItem
              icon={<RiSurveyLine className='item-responsive' />}
              title='Responder Encuesta'
              body='Cuéntanos tu experiencia durante las semanas práctica.'
              buttonText='Responder'
            />
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default ToDoList;
