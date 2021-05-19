import React, { useState } from 'react';
import EmptyHomeModal from './extras/EmptyHomeModal';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './extras/Student.css';

function EmptyHome(props){
    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);
    
    return (
        <Box m='auto' m={10}>
            <Grid direction='column' className='text-center'>
                    <Grid item>
                        <Hidden xsDown>
                            <img width='300' height='220' src='EmptyState-2x.png'/>
                        </Hidden>
                        <Typography variant='h6'>No tienes prácticas programadas de momento.</Typography>
                        <Typography className='text-muted small' variant='p'>Declara tu práctica y cosas mágicas pasarán ;)</Typography>
                    </Grid>
                    <Grid item style={{ marginTop: '1rem' }}>
                        <Button variant='outlined' color='primary' onClick={toggleShow}>Declarar Práctica</Button>
                    </Grid>
            </Grid>
            <EmptyHomeModal show={basicModal} close={toggleShow} setModal={setBasicModal} practicas={props.practicas}/>
        </Box>
    );
}

export default EmptyHome;