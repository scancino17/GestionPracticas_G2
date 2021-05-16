import React from 'react';
import DetailedStepper from './extras/DetailedStepper';
import ToDoList from './extras/ToDoList';
import './extras/mdb.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './extras/Student.css';
import { 
    MDBContainer
} from 'mdb-react-ui-kit';
import Stories from './extras/Stories';

function DetailedHome(props){
    return (
        <>
        <MDBContainer style={{paddingBottom:'5rem'}}>
            <DetailedStepper/>
            <ToDoList done={props.allDone}/>
            <Stories/>
        </MDBContainer>
        </>
    );
}
export default DetailedHome;