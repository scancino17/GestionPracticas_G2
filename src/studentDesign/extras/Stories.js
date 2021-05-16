import React from 'react';
import { 
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,
    MDBCol,
    MDBRow
} from 'mdb-react-ui-kit';
function Stories() {
  return (
      <MDBRow className='mt-5'>
          <MDBCol>
            <MDBCard style={{ maxWidth: '22rem' }}>
                <MDBCardImage src='story-1.png' position='top' alt='...' />
                <MDBCardBody>
                    <MDBCardTitle>¡Redacta un gran informe!</MDBCardTitle>
                    <MDBCardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <MDBCol>
            <MDBCard style={{ maxWidth: '22rem' }}>
                <MDBCardImage src='story-2.png' position='top' alt='...' />
                <MDBCardBody>
                    <MDBCardTitle>Prepara tu presentación</MDBCardTitle>
                    <MDBCardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <MDBCol>
            <MDBCard style={{ maxWidth: '22rem' }}>
                <MDBCardImage src='story-3.png' position='top' alt='...' />
                <MDBCardBody>
                    <MDBCardTitle>En el ambiente de trabajo</MDBCardTitle>
                    <MDBCardText>
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </MDBRow>
  );
}

export default Stories;