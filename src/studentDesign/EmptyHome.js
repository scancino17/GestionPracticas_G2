import React, { useState } from 'react';
import EmptyHomeModal from './extras/EmptyHomeModal';
import { 
    MDBTypography, 
    MDBContainer, 
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './extras/Student.css';

function EmptyHome(props){
    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);
    
    return (
        <MDBContainer>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <div className='text-center text-black'>
                    <img className='mb-3 mt-5' width="300" height="220" src='EmptyState-2x.png'/>
                    <MDBTypography variant='h4'>No tienes prácticas programadas de momento.</MDBTypography>
                    <MDBTypography className='text-muted small' variant='p'>Declara tu práctica y cosas mágicas pasarán ;)</MDBTypography>
                    <MDBBtn outline rounded onClick={toggleShow}>Declarar Práctica</MDBBtn>
                </div>
            </MDBRow>
            <EmptyHomeModal show={basicModal} close={toggleShow} setModal={setBasicModal} practicas={props.practicas}/>
        </MDBContainer>
    );
}

export default EmptyHome;