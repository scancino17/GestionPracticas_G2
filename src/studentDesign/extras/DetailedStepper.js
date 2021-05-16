import React from 'react';
import { 
    MDBTypography,
    MDBContainer,
    MDBTooltip, 
    MDBRow,
} from 'mdb-react-ui-kit';
import { 
    FaRegUserCircle,
    FaFlagCheckered,
    FaWpforms 
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

function DetailedStepper() {
    
    const icons = [
        <FiClock/>,
        <FaWpforms/>,
        <FaRegUserCircle/>,
        <FaFlagCheckered/>
    ];

    const tooltips = [
        'Práctica Declarada',
        'Completando Formularios',
        'Práctica en Curso',
        'Práctica Terminada'
    ];

    const createStepper = (active) => {
        var steps = []
        for (let i = 0; i < 4; i++){
            steps.push(
                <li key={i} className='stepper-step'>
                    <div className={`stepper-head ${i < active ? 'stepper-completed' : ''} ${i === active ? 'stepper-active' : ''}`}>
                    <MDBTooltip tag='span' wrapperClass='stepper-head-icon' title={tooltips[i]}>
                        {icons[i]}
                    </MDBTooltip>
                    </div>
                </li>
            )
        }
        return steps
    }

    return (
        <MDBContainer>
            <MDBRow className='border mt-5 rounded'>
                <MDBTypography className='mt-3' variant='h4'>Práctica X: Google</MDBTypography>
                <MDBTypography className='text-muted small d-none d-sm-block' variant='p'>Supervisor: Sundar Pichai · Dirección: Palo Alto, CA · Modalidad: Remoto</MDBTypography>
                <hr className='mt-3'/>
                <ul className="stepper">
                {
                    createStepper(1)
                }
                </ul>
            </MDBRow>
        </MDBContainer>
    );
}
export default DetailedStepper;