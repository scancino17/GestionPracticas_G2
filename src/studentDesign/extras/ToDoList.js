import React, { useEffect, useState } from 'react';
import { 
    MDBTypography,
    MDBContainer, 
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBListGroup,
    MDBListGroupItem,
    MDBCollapse
} from 'mdb-react-ui-kit';
import { 
    FaChevronDown,
    FaChevronUp,
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
        <MDBContainer>
            <MDBRow className='align-items-center'>
                <MDBCol>
                    {props.icon}
                    <div className='d-inline-block ms-4 mt-3 align-middle'>
                        <MDBTypography variant='h5'>{props.title}</MDBTypography>
                        <MDBTypography className='text-muted small' variant='p'>{props.body}</MDBTypography>
                    </div>
                </MDBCol>
                <MDBCol>
                    <MDBBtn outline rounded className='float-end'>{props.bottonText}</MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
} 

function ToDoList(props) {
    const [showShow, setShowShow] = useState(false);
    const toggleShow = () => setShowShow(!showShow);

    return(
        <MDBContainer>
            <MDBRow className='border mt-5 rounded pb-3'>
                <MDBCol onClick={toggleShow}>
                    <MDBTypography className='mt-4 d-inline-block' variant='h4'>Lista de Pendientes</MDBTypography>
                    {!showShow ?
                        <FaChevronDown className='d-inline-block float-end mt-4 me-3' size='1.5rem'/> :
                        <FaChevronUp className='d-inline-block float-end mt-4 me-3' size='1.5rem'/>
                    }
                </MDBCol>
                <MDBCollapse show={showShow}>
                    <hr/>
                    {!props.done ?
                        (
                            <MDBListGroup flush style={{ minWidth: '22rem' }}>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<FiDownload className='d-inline-block float-left item-responsive'/>} 
                                        title='Descargar Documentos'
                                        body='Descarga los documentos que tu carrera solicita adjuntar.' 
                                        bottonText='Descargar'
                                    />
                                </MDBListGroupItem>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<FaWpforms className='d-inline-block float-left item-responsive'/>} 
                                        title='Completar Formulario' 
                                        body='Completa el formulario de inscripción de práctica.' 
                                        bottonText='Completar'
                                    />
                                </MDBListGroupItem>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<FaWpforms className='d-inline-block float-left item-responsive'/>} 
                                        title='Corregir Formulario' 
                                        body='El formulario que enviaste requiere correcciones.' 
                                        bottonText='Corregir'
                                    />
                                </MDBListGroupItem>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<IoDocumentAttachOutline className='d-inline-block float-left item-responsive'/>} 
                                        title='Enviar Informe'
                                        body='Cuéntanos lo que has aprendido durante la práctica.' 
                                        bottonText='Enviar'
                                    />
                                </MDBListGroupItem>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<IoDocumentAttachOutline className='d-inline-block float-left item-responsive'/>} 
                                        title='Corregir Informe'
                                        body='El informe que has enviado requiere correcciones.' 
                                        bottonText='Corregir'
                                    />
                                </MDBListGroupItem>
                                <MDBListGroupItem>
                                    <ToDoItem 
                                        icon={<RiSurveyLine className='d-inline-block float-left item-responsive'/>} 
                                        title='Responder Encuesta'
                                        body='Cuéntanos tu experiencia durante las semanas práctica.' 
                                        bottonText='Responder'
                                    />
                                </MDBListGroupItem>
                            </MDBListGroup>
                        ) :
                        (
                            <MDBRow className='d-flex justify-content-center align-items-center h-100 mb-2'>
                                <div className='text-center text-black'>
                                    <img className='mb-3' width="300" height="220" src='AllDone.png'/>
                                    <MDBTypography variant='h4'>No tienes tareas pendientes de momento.</MDBTypography>
                                    <MDBTypography className='text-muted small' variant='p'>Ve, descansa. Si surje algo, te avisamos ;)</MDBTypography>
                                </div>
                            </MDBRow>
                        )
                    }
                </MDBCollapse>
            </MDBRow>
        </MDBContainer>
        
    );
}

export default ToDoList;