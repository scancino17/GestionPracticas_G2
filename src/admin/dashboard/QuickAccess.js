import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBRow,
  MDBTypography
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { FiCheckCircle } from 'react-icons/fi';
import CountUp from 'react-countup';

function QuickAccess({ title, number }) {
  return number <= 0 ? (
    <MDBCard
      shadow='0'
      border='success'
      background='white'
      className='mb-3 ms-3'
      style={{ maxWidth: '18rem' }}>
      <MDBCardBody className='text-success'>
        <MDBRow>
          <MDBCol>
            <MDBCardTitle>{title}</MDBCardTitle>
          </MDBCol>
          <FiCheckCircle size='3rem' />
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  ) : (
    <MDBCard
      shadow='0'
      border='warning'
      background='white'
      className='mb-3  ms-3'
      style={{ maxWidth: '18rem' }}>
      <MDBCardBody className='text-warning'>
        <MDBRow>
          <MDBCol>
            <MDBCardTitle>{title}</MDBCardTitle>
            <MDBTypography className='text-center' variant='h2'>
              <CountUp end={number} duration={3} />
            </MDBTypography>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
}

export default QuickAccess;
