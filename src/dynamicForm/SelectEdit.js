import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';

import { useEffect, useState } from 'react';
import { DEFAULT_CAREER, useUser } from '../providers/User';
import CareerSelector from '../utils/CareerSelector';
import EditBuilderPreview from './builder_preview/EditBuilderPreview';
import { FormTypes } from './camps/FormTypes';

function SelectEdit() {
  const { careerId } = useUser();
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCareer, setSelectedCareer] = useState(careerId);
  const [currentCareer, setCurrentCareer] = useState(careerId);

  const handleChangeTab = (event, newValue) => {
    event.preventDefault();

    setSelectedTab(newValue);
    if (currentCareer === DEFAULT_CAREER) {
      setCurrentTab(newValue);
    }
  };

  const handleChangeCareer = (newValue) => {
    setSelectedCareer(newValue);
    if (currentCareer === DEFAULT_CAREER) {
      setCurrentCareer(newValue);
    }
  };

  useEffect(
    () => console.log(currentTab, selectedTab, currentCareer, selectedCareer),
    [selectedTab, currentTab, currentCareer, selectedCareer]
  );

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
                careerId={currentCareer}
                setCareerId={handleChangeCareer}
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
            value={currentTab}
            onChange={handleChangeTab}
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
      {currentTab === 0 && selectedCareer !== DEFAULT_CAREER && (
        <EditBuilderPreview
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
          selectedCareer={selectedCareer}
          setSelectedCareer={setSelectedCareer}
          currentCareer={currentCareer}
          setCurrentCareer={setCurrentCareer}
          formType={FormTypes.ApplicationForm}
        />
      )}

      {currentTab === 1 && selectedCareer !== DEFAULT_CAREER && (
        <EditBuilderPreview
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
          selectedCareer={selectedCareer}
          setSelectedCareer={setSelectedCareer}
          currentCareer={currentCareer}
          setCurrentCareer={setCurrentCareer}
          formType={FormTypes.SurveyForm}
        />
      )}

      {currentTab === 2 && selectedCareer !== DEFAULT_CAREER && (
        <EditBuilderPreview
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
          selectedCareer={selectedCareer}
          setSelectedCareer={setSelectedCareer}
          currentCareer={currentCareer}
          setCurrentCareer={setCurrentCareer}
          formType={FormTypes.EvaluationForm}
        />
      )}

      {selectedCareer === DEFAULT_CAREER && (
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
