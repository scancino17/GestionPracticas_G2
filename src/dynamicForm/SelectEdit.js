import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';

import { useEffect, useState } from 'react';
import { DEFAULT_CAREER, useUser } from '../providers/User';
import CareerSelector from '../utils/CareerSelector';
import EditBuilderPreview from './builder_preview/EditBuilderPreview';

function SelectEdit() {
  const { careerId } = useUser();
  const [value, setValue] = useState(0);
  const [valueTab, setValueTab] = useState(0);
  const [selectedCareerId, setSelectedCareerId] = useState(careerId);
  const [selectedCareerIdTab, setSelectedCareerIdTab] = useState(careerId);

  const handleChange = (event, newValue) => {
    if (selectedCareerIdTab === DEFAULT_CAREER) {
      setValue(newValue);
      setValueTab(newValue);
    }
    console.log(newValue);
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
        <Typography variant='h4'>Edición de formularios</Typography>

        <Grid item>
          <Grid container direction='row'>
            <Grid item>
              <CareerSelector
                careerId={selectedCareerIdTab}
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
            indicatorColor='secondary'
            variant='fullWidth'
            scrollButtons
            allowScrollButtonsMobile
            value={valueTab}
            onChange={handleChange}
            aria-label='wrapped label tabs example'>
            <Tab
              value={0}
              label='Edición formulario de inscripción de práctica'
            />
            <Tab
              value={1}
              label='Edición formulario de encuesta de satisfacción'
            />
            <Tab
              value={2}
              label='Edición formulario de evaluación del estudiante'
            />
          </Tabs>
        </Box>
      </Grid>
      {valueTab === 0 && selectedCareerId !== DEFAULT_CAREER && (
        <EditBuilderPreview
          open={valueTab === 0}
          value={value}
          setValue={setValue}
          setValueTab={setValueTab}
          valueTab={valueTab}
          careerId={selectedCareerId}
          setCareerId={setSelectedCareerId}
          careerIdTab={selectedCareerIdTab}
          setCareerIdTab={setSelectedCareerIdTab}
          EditForm
        />
      )}

      {valueTab === 1 && selectedCareerId !== DEFAULT_CAREER && (
        <EditBuilderPreview
          open={valueTab === 1}
          value={value}
          setValue={setValue}
          setValueTab={setValueTab}
          valueTab={valueTab}
          careerId={selectedCareerId}
          setCareerId={setSelectedCareerId}
          careerIdTab={selectedCareerIdTab}
          setCareerIdTab={setSelectedCareerIdTab}
          EditSurvey
        />
      )}

      {valueTab === 2 && selectedCareerId !== DEFAULT_CAREER && (
        <EditBuilderPreview
          open={valueTab === 2}
          value={value}
          setValue={setValue}
          setValueTab={setValueTab}
          valueTab={valueTab}
          careerId={selectedCareerId}
          setCareerId={setSelectedCareerId}
          careerIdTab={selectedCareerIdTab}
          setCareerIdTab={setSelectedCareerIdTab}
          EditEvaluation
        />
      )}

      {selectedCareerId === DEFAULT_CAREER && (
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
      )}
    </Grid>
  );
}

export default SelectEdit;
