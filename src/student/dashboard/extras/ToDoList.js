import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';

import { 
    FaChevronDown,
    FaWpforms
} from 'react-icons/fa';
import { 
    FiDownload
} from 'react-icons/fi';
import { 
    IoDocumentAttachOutline
} from 'react-icons/io5';
import { 
    RiSurveyLine
} from 'react-icons/ri';
import './Student.css';

function ToDoItem(props) {
    return(
        <Grid container direction="row" style={{marginBottom: '1rem', marginTop: '1rem'}} justify='space-between' wrap='nowrap'>
            <Grid container direction="row">
                <Hidden smDown>
                    <Grid item>
                        {props.icon}
                    </Grid>
                </Hidden>
                <Grid item>
                    <Typography variant='h6'>{props.title}</Typography>
                    <Hidden smDown>
                        <Typography className='text-muted small' variant='p'>{props.body}</Typography>
                    </Hidden>
                </Grid>
            </Grid>
            <Grid item>
                <Button variant='outlined' color='primary'>{props.bottonText}</Button>
            </Grid>
        </Grid>
    );
} 

function ToDoList(props) {
    return(
        <Container maxWidth='lg' style={{ marginTop: '3rem'}}>
            <Accordion>
                <AccordionSummary
                expandIcon={<FaChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography variant={'h5'}>Lista de Pendientes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {!props.done ?
                        (
                            <Box m='auto' width={1}>
                                <ToDoItem 
                                    icon={<FiDownload className='item-responsive'/>} 
                                    title='Descargar Documentos'
                                    body='Descarga los documentos que tu carrera solicita adjuntar.' 
                                    bottonText='Descargar'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<FaWpforms className='item-responsive'/>} 
                                    title='Completar Formulario' 
                                    body='Completa el formulario de inscripción de práctica.' 
                                    bottonText='Completar'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<FaWpforms className='item-responsive'/>} 
                                    title='Corregir Formulario' 
                                    body='El formulario que enviaste requiere correcciones.' 
                                    bottonText='Corregir'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<IoDocumentAttachOutline className='item-responsive'/>} 
                                    title='Enviar Informe'
                                    body='Cuéntanos lo que has aprendido durante la práctica.' 
                                    bottonText='Enviar'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<IoDocumentAttachOutline className='item-responsive'/>} 
                                    title='Corregir Informe'
                                    body='El informe que has enviado requiere correcciones.' 
                                    bottonText='Corregir'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<IoDocumentAttachOutline className='item-responsive'/>} 
                                    title='Corregir Informe'
                                    body='El informe que has enviado requiere correcciones.' 
                                    bottonText='Corregir'
                                />
                                <Divider />
                                <ToDoItem 
                                    icon={<RiSurveyLine className='item-responsive'/>} 
                                    title='Responder Encuesta'
                                    body='Cuéntanos tu experiencia durante las semanas práctica.' 
                                    bottonText='Responder'
                                />
                            </Box>
                        ) :
                        (
                            <Box m='auto'>
                                <Grid direction='column' className='text-center'>
                                    <img width="300" height="220" src='AllDone.png'/>
                                    <Typography variant='h6'>No tienes tareas pendientes de momento.</Typography>
                                    <Typography className='text-muted small' variant='p'>Ve, descansa. Si surje algo, te avisamos ;)</Typography>
                                </Grid>
                            </Box>
                        )
                    }
                </AccordionDetails>
            </Accordion>
        </Container>
        
    );
}

export default ToDoList;