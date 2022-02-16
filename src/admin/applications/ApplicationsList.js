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
import GetAppIcon from '@material-ui/icons/GetApp';
import { NavigateNext } from '@material-ui/icons';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination } from '@material-ui/lab';
import { DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Box from '@mui/material/Box';

import CareerSelector from '../../utils/CareerSelector';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';

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

function ApplicationsList() {
  const [careerId, setCareerId] = useState('general');
  const [name, setName] = useState('');
  const [statuses, setStatuses] = useState({
    reviewing: true,
    approved: true,
    rejected: true,
    needChanges: true
  });
  const { reviewing, approved, rejected, needChanges } = statuses;
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const [indice, setIndice] = useState(0);
  const estados = [
    'En revisión',
    'Aprobadas',
    'Rechazadas',
    'Necesita cambios',
    'Todos'
  ];
  const { applications } = useSupervisor();

  const filteredApplications = useMemo(() => {
    if (applications) {
      let filtered = applications.slice();
      if (careerId !== 'general')
        filtered = filtered.filter((item) => item.careerId === careerId);
      if (name !== '')
        filtered = filtered.filter((item) => item.studentName.includes(name));
      if (!reviewing)
        filtered = filtered.filter((item) => item.status !== 'En revisión');
      if (!approved)
        filtered = filtered.filter((item) => item.status !== 'Aprobado');
      if (!rejected)
        filtered = filtered.filter((item) => item.status !== 'Rechazado');
      if (!needChanges)
        filtered = filtered.filter(
          (item) => item.status !== 'Necesita cambios menores'
        );
      return filtered;
    } else return [];
  }, [
    applications,
    careerId,
    name,
    reviewing,
    approved,
    rejected,
    needChanges
  ]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const ApplicationListItem = () => {
    return (
      <>
        <List>
          {filteredApplicationsList &&
            filteredApplicationsList
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((application) => (
                <div key={application.id}>
                  <ApplicationItem application={application} />
                  <Divider />
                </div>
              ))}
        </List>
      </>
    );
  };
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);

  const filteredApplicationsList = useMemo(() => {
    if (filteredApplications) {
      let filtered = filteredApplications.slice();
      if (selectedCareerId !== 'general')
        filtered = filtered.filter(
          (item) => item.careerId === selectedCareerId
        );
      if (name !== '')
        filtered = filtered.filter((item) => item.studentName.includes(name));
      return filtered;
    } else return [];
  }, [filteredApplications, name, selectedCareerId]);

  function ExportarExcel() {
    return (
      <ExcelFile
        element={
          <Button
            fullWidth
            color='primary'
            variant='contained'
            startIcon={<GetAppIcon />}>
            Exportar datos
          </Button>
        }
        filename={`Inscripciones de práctica - ${estados[indice]}`}>
        <ExcelSheet
          data={filteredApplicationsList}
          name='Insctipciones de práctica'>
          <ExcelColumn label='Nombre estudiante' value='studentName' />
          <ExcelColumn label='N° de Matrícula' value='Número de matrícula' />
          <ExcelColumn label='RUT estudiante' value='Rut del estudiante' />
          <ExcelColumn label='Carrera' value='careerName' />
          <ExcelColumn label='Tipo de práctica' value='internshipNumber' />
          <ExcelColumn label='Correo' value='email' />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <Grid
        item
        style={{
          backgroundImage: "url('AdminBanner-Form.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography component={'span'} variant='h4'>
          Inscripciones de práctica
        </Typography>
      </Grid>
      <Container style={{ marginTop: '2rem' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant='scrollable'
              scrollButtons
              allowScrollButtonsMobile
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'>
              <Tab
                label='En revisión'
                {...a11yProps(0)}
                onClick={() => {
                  setStatuses({
                    reviewing: true,
                    approved: false,
                    rejected: false,
                    needChanges: false
                  });
                  setIndice(0);
                  setPage(1);
                }}
              />
              <Tab
                label='Aprobadas'
                {...a11yProps(1)}
                onClick={() => {
                  setStatuses({
                    reviewing: false,
                    approved: true,
                    rejected: false,
                    needChanges: false
                  });
                  setIndice(1);
                  setPage(1);
                }}
              />
              <Tab
                label='Rechazadas'
                {...a11yProps(2)}
                onClick={() => {
                  setStatuses({
                    reviewing: false,
                    approved: false,
                    rejected: true,
                    needChanges: false
                  });
                  setIndice(2);
                  setPage(1);
                }}
              />
              <Tab
                label='Necesita cambios'
                {...a11yProps(3)}
                onClick={() => {
                  setStatuses({
                    reviewing: false,
                    approved: false,
                    rejected: false,
                    needChanges: true
                  });
                  setIndice(3);
                  setPage(1);
                }}
              />
              <Tab
                label='Todos'
                {...a11yProps(4)}
                onClick={() => {
                  setStatuses({
                    reviewing: true,
                    approved: true,
                    rejected: true,
                    needChanges: true
                  });
                  setIndice(4);
                  setPage(1);
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={indice}>
            <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label='Buscar estudiante'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CareerSelector
                  careerId={selectedCareerId}
                  setCareerId={setSelectedCareerId}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ExportarExcel />
              </Grid>
            </Grid>

            <Divider />
            <ApplicationListItem />
            <Grid container justifyContent='flex-end'>
              {filteredApplicationsList &&
              filteredApplicationsList.length > 0 ? (
                <Pagination
                  count={Math.ceil(
                    filteredApplicationsList.length / itemsPerPage
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
                      alt='Sin inscripciones de práctica'
                    />
                  </Grid>
                  <Typography
                    component={'span'}
                    variant='h5'
                    color='textSecondary'>
                    No hay inscripciones de práctica disponibles
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Box>
      </Container>
    </Grid>
  );
}

function ApplicationItem({ application }) {
  const navigate = useNavigate();

  return (
    <ListItem
      key={application.toString()}
      button
      onClick={() => navigate(`/applications/${application.id}`)}>
      <ListItemText
        primary={application.studentName}
        secondary={`${application['Rut del estudiante']} - Práctica ${application.internshipNumber} - ${application.careerInitials}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => navigate(`/applications/${application.id}`)}>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ApplicationsList;
