import React from 'react';
import CustomStepper from './extras/CustomStepper';
import Container from '@material-ui/core/Container';
import ToDoList from './extras/ToDoList';
import './extras/Student.css';
import Stories from './extras/Stories';

function DetailedHome(props) {
  return (
    <>
      <Container style={{ paddingBottom: '5rem' }}>
        <CustomStepper />
        <ToDoList done={props.done} />
        <Stories />
      </Container>
    </>
  );
}
export default DetailedHome;
