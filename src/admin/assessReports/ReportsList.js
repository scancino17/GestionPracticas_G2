import React, { useState, useMemo } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  List,
  Button,
  Box
} from '@material-ui/core';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GetAppIcon from '@material-ui/icons/GetApp';
import { NavigateNext } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import {
  evaluatedInternship,
  finishedInternship,
  sentReport
} from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';

import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  normalizeString,
  toLegibleDate,
  toLegibleTime
} from '../../utils/FormatUtils';
import PropTypes from 'prop-types';
import { Pagination } from '@material-ui/lab';
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

function ReportsList() {
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const { userRole } = useUser();
  const { internships } = useSupervisor();
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [indice, setIndice] = useState(0);
  const [selected, setSelected] = useState({ read: false, notRead: true });
  const { read, notRead } = selected;
  const itemsPerPage = 8;
  const [startDate, setStartDate] = useState(
    new Date() - 1000 * 60 * 60 * 24 * 30 * 2
  );
  const [endDate, setEndDate] = useState(new Date());
  const sentReportsList = useMemo(() => {
    if (internships) {
      let filtered = internships.slice();
      filtered = filtered.filter(
        (item) =>
          (item.status === sentReport && notRead) ||
          (item.status === finishedInternship && read)
      );
      return filtered;
    } else return [];
  }, [internships, notRead, read]);

  const filteredInternshipsList = useMemo(() => {
    let filtered = sentReportsList.slice();

    if (selectedCareerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === selectedCareerId);
    if (name !== '')
      filtered = filtered.filter((item) =>
        normalizeString(item.studentName).includes(normalizeString(name))
      );
    if (read && notRead) {
      filtered = filtered.filter(
        (item) =>
          (item.status === finishedInternship &&
            item.evaluatedReportTime &&
            item.evaluatedReportTime.seconds * 1000 <= endDate &&
            item.evaluatedReportTime.seconds * 1000 >= startDate) ||
          (item.status === sentReport &&
            item.sentReportDate &&
            item.sentReportDate.seconds * 1000 <= endDate &&
            item.sentReportDate.seconds * 1000 >= startDate)
      );
    } else if (read) {
      filtered = filtered.filter(
        (item) =>
          item.evaluatedReportTime &&
          item.evaluatedReportTime.seconds * 1000 <= endDate &&
          item.evaluatedReportTime.seconds * 1000 >= startDate
      );
    } else if (notRead) {
      filtered = filtered.filter(
        (item) =>
          item.sentReportDate &&
          item.sentReportDate.seconds * 1000 <= endDate &&
          item.sentReportDate.seconds * 1000 >= startDate
      );
    }
    filtered.sort((a, b) =>
      (a.status === sentReport && a.sentReportDate
        ? a.sentReportDate.seconds
        : a.status === finishedInternship && a.evaluatedReportTime
        ? a.evaluatedReportTime.seconds
        : null) <
      (b.status === sentReport && b.sentReportDate
        ? b.sentReportDate.seconds
        : b.status === finishedInternship && b.evaluatedReportTime
        ? b.evaluatedReportTime.seconds
        : null)
        ? 1
        : (a.status === sentReport && a.sentReportDate
            ? a.sentReportDate.seconds
            : a.status === finishedInternship && a.evaluatedReportTime
            ? a.evaluatedReportTime.seconds
            : null) ===
          (b.status === sentReport && b.sentReportDate
            ? b.sentReportDate.seconds
            : b.status === finishedInternship && b.evaluatedReportTime
            ? b.evaluatedReportTime.seconds
            : null)
        ? a.size < b.size
          ? 1
          : -1
        : -1
    );

    return filtered;
  }, [sentReportsList, selectedCareerId, name, endDate, startDate]);

  function handleChangeTab(event, newValue) {
    event.preventDefault();
    setSelectedTab(newValue);
  }

  function ExportarExcel() {
    const temp = [];
    filteredInternshipsList.forEach((doc) =>
      temp.push({
        nombre: doc.studentName,
        matricula: doc.applicationData['Número de matrícula'],
        rut: doc.applicationData['Rut del estudiante'],
        carrera: doc.careerName,
        practica: doc.internshipNumber,
        email: doc.studentEmail,
        sentReportDate:
          doc.status === sentReport
            ? doc.sentReportDate
            : doc.evaluatedReportTime,
        grade: doc.grade ? doc.grade : 'No evaluada',
        status: doc.status
      })
    );

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
        filename={`Estudiantes con evaluación de informe pendiente`}>
        <ExcelSheet data={temp} name='Extensiones de práctica'>
          <ExcelColumn
            label='Fecha'
            value={(col) => toLegibleDate(col.sentReportDate)}
          />
          <ExcelColumn
            label='Hora'
            value={(col) => toLegibleTime(col.sentReportDate)}
          />
          <ExcelColumn label='Nombre estudiante' value='nombre' />
          <ExcelColumn label='N° de Matrícula' value='matricula' />
          <ExcelColumn label='RUT estudiante' value='rut' />
          <ExcelColumn label='Carrera' value='carrera' />
          <ExcelColumn label='Tipo de práctica' value='practica' />
          <ExcelColumn label='Correo' value='email' />
          <ExcelColumn label='Nota' value='grade' />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Evaluate.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Evaluar informes de práctica</Typography>
      </div>

      <Container style={{ marginTop: '2rem' }}>
        <Box sx={{ width: '100%', marginBottom: '1rem' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant='scrollable'
              scrollButtons
              allowScrollButtonsMobile
              value={selectedTab}
              onChange={handleChangeTab}
              aria-label='Selección de observaciones a mostrar'>
              <Tab
                label='No Evaluadas'
                {...a11yProps(0)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: false, notRead: true });
                  setIndice(0);
                  setPage(1);
                }}
              />
              <Tab
                label='Evaluadas'
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
          <Divider />
        </Box>
        <TabPanel value={selectedTab} index={indice}>
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container item xs={12} direction='row' spacing={2}>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    label={'Fecha inicio'}
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    fullWidth
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    label={'Fecha Fin'}
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>

          {filteredInternshipsList.length > 0 ? (
            <>
              <List>
                {filteredInternshipsList
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((internship) => (
                    <div key={internship.id}>
                      <ReportItem internship={internship} />
                      <Divider />
                    </div>
                  ))}
              </List>
              <Grid
                container
                justifyContent='flex-end'
                style={{ marginTop: '2rem' }}>
                <Pagination
                  count={Math.ceil(
                    filteredInternshipsList.length / itemsPerPage
                  )}
                  page={page}
                  color='primary'
                  style={{ marginBottom: '40px' }}
                  onChange={(_, val) => setPage(val)}
                />
              </Grid>
            </>
          ) : (
            <Grid
              container
              direction='column'
              align='center'
              justifyContent='center'
              style={{ marginTop: '6rem' }}>
              <Grid item>
                <img
                  src='evaluate.png'
                  width='300'
                  alt='Sin informes de practica disponibles'
                />
              </Grid>
              <Typography variant='h5' color='textSecondary'>
                No hay informes de práctica disponibles
              </Typography>
            </Grid>
          )}
        </TabPanel>
      </Container>
    </Grid>
  );
}

function ReportItem({ internship }) {
  const navigate = useNavigate();
  return (
    <ListItem
      button
      onClick={() =>
        navigate(
          `/internship-assessment/${internship.studentId}/${internship.id}`
        )
      }>
      <ListItemText
        primary={internship.studentName}
        secondary={`${
          internship.applicationData['Rut del estudiante']
        } - Práctica ${internship.internshipNumber} - ${
          internship.careerInitials
        } - ${
          internship.status === sentReport
            ? `Enviada el ${toLegibleDate(internship.sentReportDate)}`
            : internship.evaluatedReportTime
            ? `Evaluada el ${toLegibleDate(internship.evaluatedReportTime)}`
            : 'Fecha de evaluación no disponible'
        }${
          internship.status === finishedInternship
            ? ` - Nota: ${internship.grade}`
            : ''
        }`}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            navigate(
              `/internship-assessment/${internship.studentId}/${internship.id}`
            )
          }>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ReportsList;
