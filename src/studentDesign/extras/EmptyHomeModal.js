import React, { useState } from 'react';
import Practicas from '../../student/dashboard/extras/Practicas';

import { MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

function EmptyHomeModal(props){
    return(
        <MDBModal show={props.show} getOpenState={(e) => props.setModal(e)} tabIndex='-1'>
            <MDBModalDialog>
                <MDBModalContent>
                <MDBModalHeader>
                    <MDBModalTitle>Prácticas Disponibles</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={props.close}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                    <Practicas practicas={props.practicas} />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn outline rounded className='text-dark' color='light' onClick={props.close}>Cerrar</MDBBtn>
                </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
}

export default EmptyHomeModal;