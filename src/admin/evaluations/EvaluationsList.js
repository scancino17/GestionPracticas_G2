import React, { useMemo, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';
import { GetApp, NavigateNext } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </Grid>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function EvaluationItem({ evaluation }) {
  const navigate = useNavigate();

  return (
    <ListItem button onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
      <ListItemText
        primary={evaluation.studentName}
        secondary={`${evaluation.studentRut} - Práctica ${evaluation.internshipNumber} - ${evaluation.careerInitials}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function EvaluationsList() {
  const { userRole } = useUser();
  const { employerEvaluations } = useSupervisor();
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [selected, setSelected] = useState({ read: false, notRead: true });
  const itemsPerPage = 8;
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [indice, setIndice] = useState(0);

  const filteredEvaluationList = useMemo(() => {
    return employerEvaluations
      .slice()
      .filter(
        (item) =>
          selectedCareerId === DEFAULT_CAREER ||
          item.careerId === selectedCareerId
      )
      .filter((item) => name === '' || item.studentName.includes(name))
      .filter(
        (item) =>
          (item.read && selected.read) || (!item.read && selected.notRead)
      );
  }, [employerEvaluations, selectedCareerId, name, selected]);

  function handleChangeTab(event, newValue) {
    event.preventDefault();
    setSelectedTab(newValue);
  }

  function ExportarExcel() {
    const estados = ['Leídos', 'No leídos', 'Todos'];

    return (
      <ExcelFile
        element={
          <Button
            fullWidth
            color='primary'
            variant='contained'
            startIcon={<GetApp />}>
            Exportar datos
          </Button>
        }
        filename={`Inscripciones de práctica - ${estados[indice]}`}>
        <ExcelSheet
          data={filteredEvaluationList}
          name='Lista de evaluación de supervisores'>
          <ExcelColumn label='Nombre estudiante' value='studentName' />
          <ExcelColumn label='N° de Matrícula' value='studentNumber' />
          <ExcelColumn label='RUT estudiante' value='studentRut' />
          <ExcelColumn label='Carrera' value='careerName' />
          <ExcelColumn label='Tipo de práctica' value='internshipNumber' />
          <ExcelColumn label='Correo' value='studentEmail' />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <Grid
        style={{
          backgroundImage: "url('AdminBanner-Form.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography component={'span'} variant='h4'>
          Evaluación de supervisores
        </Typography>
      </Grid>
      <Container style={{ marginTop: '2rem' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant='scrollable'
              scrollButtons
              allowScrollButtonsMobile
              value={selectedTab}
              onChange={handleChangeTab}
              aria-label='Selección de observaciones a mostrar'>
              <Tab
                label='No leído'
                {...a11yProps(0)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: false, notRead: true });
                  setIndice(0);
                  setPage(1);
                }}
              />
              <Tab
                label='Leído'
                {...a11yProps(1)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: true, notRead: false });
                  setIndice(1);
                  setPage(1);
                }}
              />
              <Tab
                label='Todas'
                {...a11yProps(2)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: true, notRead: true });
                  setIndice(2);
                  setPage(1);
                }}
              />
            </Tabs>
          </Box>
        </Box>
        <TabPanel value={selectedTab} index={indice}>
          <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
            <Grid item xs={12} sm={userRole === ADMIN_ROLE ? 4 : 8}>
              <TextField
                fullWidth
                label='Buscar por nombre'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            {userRole === ADMIN_ROLE && (
              <Grid item xs={12} sm={4}>
                <CareerSelector
                  careerId={selectedCareerId}
                  setCareerId={setSelectedCareerId}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <ExportarExcel />
            </Grid>
            <Divider />
            <Container style={{ marginTop: '2rem' }}>
              <List>
                {filteredEvaluationList
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((evaluation) => (
                    <>
                      <EvaluationItem evaluation={evaluation} />
                      <Divider />
                    </>
                  ))}
              </List>
            </Container>
            <Grid
              container
              justifyContent='flex-end'
              style={{ marginTop: '2rem' }}>
              {filteredEvaluationList.length > 0 ? (
                <Pagination
                  count={Math.ceil(
                    filteredEvaluationList.length / itemsPerPage
                  )}
                  page={page}
                  color='primary'
                  style={{ marginBottom: '40px' }}
                  onChange={(_, val) => setPage(val)}
                />
              ) : (
                <Grid
                  container
                  direction='column'
                  align='center'
                  justifyContent='center'
                  style={{ marginTop: '6rem' }}>
                  <Grid item>
                    <img
                      src='post.png'
                      width='300'
                      alt='Sin evaluaciones de supervisores'
                    />
                  </Grid>
                  <Typography variant='h5' color='textSecondary'>
                    No hay evaluaciones de supervisores pendientes.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Grid>
  );
}

export default EvaluationsList;
