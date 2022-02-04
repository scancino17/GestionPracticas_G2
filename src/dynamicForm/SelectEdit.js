import { Box, Grid, Tab, Tabs, Typography } from "@material-ui/core"; 

import { useState } from "react";
import { DEFAULT_CAREER, useUser } from "../providers/User";
import CareerSelector from "../utils/CareerSelector";
import EditForm from "./builder_preview/form/EditForm";

import EditSurvey from "./builder_preview/survey/EditSurvey";
import EditEvaluation from "./builder_preview/survey/EditSurveySupervisor";

function SelectEdit() {
    const { careerId } = useUser();
    const [update, setUpdate] = useState('');
    const [value, setValue] = useState(0);
    const [selectedCareerId, setSelectedCareerId] = useState(careerId);
    const handleChange = (event, newValue) => {
        setUpdate(newValue)
        setValue(newValue);
    };
    
    return (
        <Grid container direction='column'>
            <div
            style={{
                backgroundImage: "url('AdminBanner-Edit.png')",
              
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '2rem'
            }}>
            <Typography variant='h4'>
                Edición de formularios
            </Typography>
           
            <Grid item >
                <Grid container direction='row'>
                    <Grid item >
                        <CareerSelector
                            careerId={selectedCareerId}
                            setCareerId={setSelectedCareerId}
                            excludeGeneral
                        />
                    </Grid>
                </Grid>
            </Grid>
            </div>
            <Grid item>
            <Box sx={{ width: '100%' }}>
            <Tabs
                indicatorColor="secondary"
                variant='fullWidth'
               
                scrollButtons
                allowScrollButtonsMobile
               
                value={value}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
            >
                <Tab value={0} label="Edición formulario de inscripción de práctica"/>
                <Tab value={1} label="Edición formulario de encuesta de satisfacción" />
                <Tab value={2} label="Edición formulario de evaluación del estudiante" />
                
            </Tabs>
            </Box>
            </Grid>
                {value === 0 && selectedCareerId!==DEFAULT_CAREER && <EditForm careerId={selectedCareerId}/>}
                {value === 1 && selectedCareerId!==DEFAULT_CAREER && <EditSurvey careerId={selectedCareerId}/>}
                {value === 2 && selectedCareerId!==DEFAULT_CAREER && <EditEvaluation careerId={selectedCareerId}/>}
                {selectedCareerId===DEFAULT_CAREER && 
                    <Grid
                        container
                        direction='column'
                        align='center'
                        justifyContent='center'
                        style={{ marginTop: '6rem' }}>
                        <Grid item>
                        <img src='EmptyState-3x.png' width='300' alt='Banner' />
                        </Grid>
                        <Grid item>
                        <Typography variant='h5' color='textSecondary'>
                            Selecciona una carrera para continuar
                        </Typography>
                        </Grid>
                    </Grid>
                }
    
        </Grid>
    )
}

export default SelectEdit;
