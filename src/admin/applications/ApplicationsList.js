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
import { DEFAULT_CAREER, useUser, ADMIN_ROLE } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Box from '@mui/material/Box';
import DateFnsUtils from '@date-io/date-fns';
import CareerSelector from '../../utils/CareerSelector';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { normalizeString, toLegibleDate } from '../../utils/FormatUtils';

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
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(
    new Date() - 1000 * 60 * 60 * 24 * 30 * 2
  );
  const [endDate, setEndDate] = useState(new Date());
  const [statuses, setStatuses] = useState({
    reviewing: true,
    approved: false,
    rejected: false,
    needChanges: false
  });
  const { reviewing, approved, rejected, needChanges } = statuses;
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [indice, setIndice] = useState(0);
  const estados = [
    'En revisión',
    'Aprobadas',
    'Rechazadas',
    'Necesita cambios',
    'Todos'
  ];
  const { userRole } = useUser();
  const { applications } = useSupervisor();

  const filteredApplications = useMemo(() => {
    if (applications) {
      let filtered = applications.slice();
      if (needChanges && rejected && approved && reviewing) {
        filtered = filtered.filter(
          (item) =>
            (item.status === 'En revisión' &&
              item.creationDate &&
              item.creationDate.seconds * 1000 <= endDate &&
              item.creationDate.seconds * 1000 >= startDate) ||
            (item.status === 'Aprobado' &&
              item.approvedDate &&
              item.approvedDate.seconds * 1000 <= endDate &&
              item.approvedDate.seconds * 1000 >= startDate) ||
            (item.status === 'Rechazado' &&
              item.rejectDate &&
              item.rejectDate.seconds * 1000 <= endDate &&
              item.rejectDate.seconds * 1000 >= startDate) ||
            (item.status === 'Necesita cambios menores' &&
              item.minorChangeRequestDate &&
              item.minorChangeRequestDate.seconds * 1000 <= endDate &&
              item.minorChangeRequestDate.seconds * 1000 >= startDate)
        );
      } else if (reviewing)
        filtered = filtered.filter(
          (item) =>
            item.status === 'En revisión' &&
            item.creationDate &&
            item.creationDate.seconds * 1000 <= endDate &&
            item.creationDate.seconds * 1000 >= startDate
        );
      else if (approved)
        filtered = filtered.filter(
          (item) =>
            item.status === 'Aprobado' &&
            item.approvedDate &&
            item.approvedDate.seconds * 1000 <= endDate &&
            item.approvedDate.seconds * 1000 >= startDate
        );
      else if (rejected)
        filtered = filtered.filter(
          (item) =>
            item.status === 'Rechazado' &&
            item.rejectDate &&
            item.rejectDate.seconds * 1000 <= endDate &&
            item.rejectDate.seconds * 1000 >= startDate
        );
      else if (needChanges)
        filtered = filtered.filter(
          (item) =>
            item.status === 'Necesita cambios menores' &&
            item.minorChangeRequestDate &&
            item.minorChangeRequestDate.seconds * 1000 <= endDate &&
            item.minorChangeRequestDate.seconds * 1000 >= startDate
        );

      filtered.sort((a, b) =>
        (a.status === 'En revisión' && a.creationDate
          ? a.creationDate.seconds
          : a.status === 'Aprobado' && a.approvedDate
          ? a.approvedDate.seconds
          : a.status === 'Rechazado' && a.rejectDate
          ? a.rejectDate.seconds
          : a.status === 'Necesita cambios menores' && a.minorChangeRequestDate
          ? a.minorChangeRequestDate.seconds
          : null) <
        (b.status === 'En revisión' && b.creationDate
          ? b.creationDate.seconds
          : b.status === 'Aprobado' && b.approvedDate
          ? b.approvedDate.seconds
          : b.status === 'Rechazado' && b.rejectDate
          ? b.rejectDate.seconds
          : b.status === 'Necesita cambios menores' && b.minorChangeRequestDate
          ? b.minorChangeRequestDate.seconds
          : null)
          ? 1
          : (a.status === 'En revisión' && a.creationDate
              ? a.creationDate.seconds
              : a.status === 'Aprobado' && a.approvedDate
              ? a.approvedDate.seconds
              : a.status === 'Rechazado' && a.rejectDate
              ? a.rejectDate.seconds
              : a.status === 'Necesita cambios menores' &&
                a.minorChangeRequestDate
              ? a.minorChangeRequestDate.seconds
              : null) ===
            (b.status === 'En revisión' && b.creationDate
              ? b.creationDate.seconds
              : b.status === 'Aprobado' && b.approvedDate
              ? b.approvedDate.seconds
              : b.status === 'Rechazado' && b.rejectDate
              ? b.rejectDate.seconds
              : b.status === 'Necesita cambios menores' &&
                b.minorChangeRequestDate
              ? b.minorChangeRequestDate.seconds
              : null)
          ? a.size < b.size
            ? 1
            : -1
          : -1
      );

      return filtered;
    } else return [];
  }, [
    applications,
    reviewing,
    approved,
    rejected,
    needChanges,
    startDate,
    endDate
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
        filtered = filtered.filter((item) =>
          normalizeString(item.studentName).includes(normalizeString(name))
        );
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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                <Grid item xs={12} sm={userRole === ADMIN_ROLE ? 4 : 8}>
                  <TextField
                    fullWidth
                    label='Buscar estudiante'
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
                <Grid
                  container
                  item
                  xs={12}
                  sm={4}
                  direction='row'
                  spacing={2}
                  justifyContent='space-between'>
                  <Grid item xs={6} md={6}>
                    <DatePicker
                      disableToolbar
                      variant='inline'
                      format='dd/MM/yyyy'
                      label={'Fecha inicio'}
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <DatePicker
                      disableToolbar
                      variant='inline'
                      format='dd/MM/yyyy'
                      label={'Fecha Fin'}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </Grid>
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
    </MuiPickersUtilsProvider>
  );
}

function ApplicationItem({ application }) {
  const navigate = useNavigate();

  function dateString(application) {
    if (application.status === 'En revisión' && application.creationDate) {
      return 'Enviada el ' + toLegibleDate(application.creationDate);
    } else if (application.status === 'Aprobado' && application.approvedDate) {
      return 'Aprobada el ' + toLegibleDate(application.approvedDate);
    } else if (application.status === 'Rechazado' && application.rejectDate) {
      return 'Rechazada el ' + toLegibleDate(application.rejectDate);
    } else if (application.status === 'Necesita cambios menores') {
      return (
        'Se solicitaron cambios el ' +
        toLegibleDate(application.minorChangeRequestDate)
      );
    }
  }

  return (
    <ListItem
      key={application.toString()}
      button
      onClick={() => navigate(`/applications/${application.id}`)}>
      <ListItemText
        primary={application.studentName}
        secondary={
          <React.Fragment>
            {`${application['Rut del estudiante']} - Práctica ${application.internshipNumber} - ${application.careerInitials} - `}
            <Typography
              sx={{ display: 'inline' }}
              component='span'
              variant='body2'
              color='primary'>
              <strong>{dateString(application)}</strong>
            </Typography>
          </React.Fragment>
        }
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
