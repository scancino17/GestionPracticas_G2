import React, { useEffect, useState } from 'react';
import useAuth from '../providers/Auth';
import { db } from '../firebase';
import EmptyHome from './EmptyHome';
import DetailedHome from './DetailedHome';
import {
    MDBTypography,
    MDBFooter
} from 'mdb-react-ui-kit';

function StudentHome(props) {
    const { user, userData } = useAuth();
    const [loaded, setLoaded] = useState(false);
    const [practicas, setPracticas] = useState([]);

    useEffect(() => {
        if (userData) {
        db.collection('internships')
            .where('studentId', '==', user.uid)
            .get()
            .then((querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) =>
                temp.push({ id: doc.id, ...doc.data() })
            );
            setPracticas(temp);
            setLoaded(true);
            });
        }
    }, [user, userData]);

    return (
        <>
        <div className='p-5 text-center bg-image banner' style={{ backgroundImage: "url('HomeBanner-2x.png')"}}>
            <div className='mask'>
                <div className='d-flex align-items-center h-100'>
                    <div className='text-black'>
                        <MDBTypography className='m-5' variant='h2'>¡Bienvenido, {userData && userData.name}!</MDBTypography>
                    </div>
                </div>
            </div>
        </div>
        {props.onGoingIntern  ? <DetailedHome allDone={props.allDone}/> : <EmptyHome practicas={practicas}/> }
        <MDBFooter backgroundColor='light' className='text-center mt-3 text-lg-left position-relative'>
            <div className='text-center p-3' style={{ backgroundColor: 'rgba(205, 205, 205)' }}>
                Hecho con &hearts; por el equipo Paw Patrol
            </div>
        </MDBFooter>
        </>
    );
}

export default StudentHome;