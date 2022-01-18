import Card from './extras/Card/Card';
import CardHeader from './extras/Card/CardHeader.js';
import CardBody from './extras/Card/CardBody.js';
import CardIcon from './extras/Card/CardIcon.js';
import CardFooter from './extras/Card/CardFooter.js';
import {
  MdMultilineChart,
  MdEqualizer,
  MdPieChart,
  MdPublic,
  MdUpdate
} from 'react-icons/md';
import ArchiveIcon from '@material-ui/icons/Archive';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BusinessIcon from '@material-ui/icons/Business';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../layout/BarraLateral';
import CountUp from 'react-countup';
import InternshipIntention from '../intention/InternshipIntention';
import styles from './extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import EditForm from '../../dynamicForm/EditForm';
import FormCheck from '../../dynamicForm/FormCheck';
import VerticalBar from './extras/charts/VerticalBar';
import PieChart from './extras/charts/PieChart';
import TableChart from './extras/charts/TableChart';
import GroupedBarChart from './extras/charts/GroupedBarChart';
import ImportStudents from '../import/ImportStudents';
import { db } from '../../firebase';
import {
  pendingIntention,
  sentReport,
  onGoingIntenship
} from '../../InternshipStates';
import Insurance from '../insurance/Insurance';
import CareerSelector from '../../utils/CareerSelector';
import ReportsList from '../assessReports/ReportsList';
import AssessReport from '../assessReports/AssessReport';
import ExtensionList from '../extension/ExtensionList';
import CareersSettings from '../careersSettings/CareersSettings';
import SupervisorManagement from '../supervisorManagement/SupervisorManagement';
import ExcelExporter from '../../utils/ExcelExporter';
import { useUser } from '../../providers/User';

// La siguiente línea registra todos los elementos de chart.js
// No es inútil: eliminarla romperá TODOS los gráficos al recargar los gráficos.
import Chart from 'chart.js/auto';

function DashboardAdmin({ sidebarProps }) {
  const { user } = useUser();
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const navigate = useNavigate();
  const [intentionsCount, setIntentionsCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);
  const [careerId, setCareerId] = useState('3407');
  const [topCompaniesRegistered, setTopCompaniesRegistered] = useState([]);
  const [internStatus, setInternStatus] = useState([]);
  const [internCountries, setInternCountries] = useState([]);
  const [applicationsStatus, setApplicationsStatus] = useState([]);

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('internships').where('careerId', '==', user.careerId)
      : db.collection('internships');
    const unsubscribe = dbRef
      .where('status', '==', pendingIntention)
      .onSnapshot((querySnapshot) => setIntentionsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('applications').where('careerId', '==', user.careerId)
      : db.collection('applications');
    const unsubscribe = dbRef
      .where('status', '==', 'En revisión')
      .onSnapshot((querySnapshot) => setFormsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('internships').where('careerId', '==', user.careerId)
      : db.collection('internships');
    const unsubscribe = dbRef
      .where('status', '==', sentReport)
      .onSnapshot((querySnapshot) => setReportsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('Dashboard  Montado');
    return () => console.log('Dashboard desmontado');
  }, []);

  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('users').where('careerId', '==', user.careerId)
      : db.collection('users');
    const unsubscribe = dbRef
      .where('step', '>=', 2)
      .onSnapshot((querySnapshot) => setInternshipCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => console.log(user.careerId, careerId), [careerId]);

  return (
    <div style={{ display: 'flex' }}>
      <BarraLateral {...sidebarProps} />
      <Routes>
        <Route
          exact
          path='/'
          element={
            <Container>
              <Grid
                style={{
                  backgroundImage: "url('HomeBanner-Admin.png')",
                  backgroundSize: 'cover',
                  padding: '2rem',
                  marginTop: '2rem',
                  marginBottom: '1rem',
                  borderRadius: '1rem'
                }}
                container>
                <Typography variant='h4'>Resumen del proceso</Typography>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/internship-intention')}>
                    <CardHeader color='warning' stats icon>
                      <CardIcon color='warning'>
                        <ArchiveIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>Nuevas Intenciones</p>
                      <h2 className={classes.cardTitle}>
                        <CountUp end={intentionsCount} duration={3} />
                      </h2>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <MdUpdate />
                        Actualizado recientemente
                      </div>
                    </CardFooter>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/applications')}>
                    <CardHeader color='success' stats icon>
                      <CardIcon color='success'>
                        <ListAltIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>Nuevos Formularios</p>
                      <h2 className={classes.cardTitle}>
                        <CountUp end={formsCount} duration={3} />
                      </h2>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <MdUpdate />
                        Actualizado recientemente
                      </div>
                    </CardFooter>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/internship-assessment')}>
                    <CardHeader color='danger' stats icon>
                      <CardIcon color='danger'>
                        <AssignmentIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        Informes pendientes
                      </p>
                      <h2 className={classes.cardTitle}>
                        <CountUp end={reportsCount} duration={3} />
                      </h2>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <MdUpdate />
                        Actualizado recientemente
                      </div>
                    </CardFooter>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color='info' stats icon>
                      <CardIcon color='info'>
                        <BusinessIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>Prácticas en Curso</p>
                      <h2 className={classes.cardTitle}>
                        <CountUp end={internshipCount} duration={3} />
                      </h2>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <MdUpdate />
                        Actualizado recientemente
                      </div>
                    </CardFooter>
                  </Card>
                </Grid>
              </Grid>
              <Grid
                style={{
                  backgroundImage: "url('HomeBanner-Admin-1-b.png')",
                  backgroundSize: 'cover',
                  padding: '2rem',
                  marginTop: '2rem',
                  marginBottom: '2rem',
                  borderRadius: '1rem'
                }}
                container>
                <Typography variant='h4'>Estadísticas</Typography>
              </Grid>
              {/*Charts*/}
              <Grid>
                <Card>
                  <CardHeader color='rose' icon>
                    <CardIcon color='rose'>
                      <MdMultilineChart />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Estado de los Alumnos por Carrera
                    </p>
                  </CardHeader>
                  <CardBody>
                    <GroupedBarChart setExportable={setInternStatus} />
                  </CardBody>
                  <CardFooter stats>
                    <ExcelExporter
                      filename='Estado de los Alumnos por Carrera'
                      data={internStatus}
                    />
                  </CardFooter>
                </Card>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={8} md={8}>
                  <Card>
                    <CardHeader color='warning' icon>
                      <CardIcon color='warning'>
                        <MdEqualizer />
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        Empresas más Elegidas por los Practicantes
                      </p>
                    </CardHeader>
                    <CardBody>
                      <VerticalBar setExportable={setTopCompaniesRegistered} />
                    </CardBody>
                    <CardFooter stats>
                      <ExcelExporter
                        filename='Empresas mas Elegidas por los Practicantes'
                        data={topCompaniesRegistered}
                      />
                    </CardFooter>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <Card>
                    <CardHeader color='info' icon>
                      <CardIcon color='info'>
                        <MdPieChart />
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        Aprobados y Rechazados por Carrera
                      </p>
                      {!user.careerId && (
                        <CareerSelector
                          careerId={careerId}
                          setCareerId={setCareerId}
                        />
                      )}
                    </CardHeader>
                    <CardBody>
                      <PieChart
                        careerId={careerId}
                        setExportable={setApplicationsStatus}
                      />
                    </CardBody>
                    <CardFooter stats>
                      <ExcelExporter
                        filename='Aprobados y Rechazados por Carrera'
                        data={applicationsStatus}
                      />
                    </CardFooter>
                  </Card>
                </Grid>
              </Grid>

              <Grid>
                <Card>
                  <CardHeader color='success' icon>
                    <CardIcon color='success'>
                      <MdPublic />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Prácticas registradas en el extranjero
                    </p>
                  </CardHeader>
                  <CardBody>
                    <TableChart setExportable={setInternCountries} />
                  </CardBody>
                  <CardFooter stats>
                    <ExcelExporter
                      filename='Practicas registradas en el extranjero'
                      data={internCountries}
                    />
                  </CardFooter>
                </Card>
              </Grid>
            </Container>
          }
        />
        <Route exact path='/applications' element={<ApplicationsList />} />
        <Route path='/edit-form' element={<EditForm />} />
        <Route path='/applications/:applicationId' element={<FormCheck />} />
        <Route path='/import' element={<ImportStudents />} />
        <Route path='/internship-intention' element={<InternshipIntention />} />
        <Route path='/insurance-list' element={<Insurance />} />
        <Route exact path='/internship-assessment' element={<ReportsList />} />
        <Route
          path='/internship-assessment/:studentId/:internshipId'
          element={<AssessReport />}
        />
        <Route path='/extension-list/' element={<ExtensionList />} />
        <Route path='/careers-settings' element={<CareersSettings />} />
        <Route
          path='/supervisor-management'
          element={<SupervisorManagement />}
        />
        <Route
          exact
          path='/wip'
          element={
            <Grid container direction='column' alignItems='center' mar>
              <WarningIcon fontSize='large' />
              <Typography variant='h3'>Página en construcción</Typography>
              <Typography color='textSecondary'>
                Estamos trabajando para usted
              </Typography>
            </Grid>
          }
        />
      </Routes>
    </div>
  );
}

export default DashboardAdmin;
