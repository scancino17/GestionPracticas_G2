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
import { Route, Switch, useHistory } from 'react-router-dom';
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

function DashboardAdmin({ sidebarProps }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const history = useHistory();
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
    const unsubscribe = db
      .collection('internships')
      .where('status', '==', pendingIntention)
      .onSnapshot((querySnapshot) => setIntentionsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection('applications')
      .where('status', '==', 'En revisión')
      .onSnapshot((querySnapshot) => setFormsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection('internships')
      .where('status', '==', sentReport)
      .onSnapshot((querySnapshot) => setReportsCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection('internships')
      .where('status', '==', onGoingIntenship)
      .onSnapshot((querySnapshot) => setInternshipCount(querySnapshot.size));
    return unsubscribe;
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <BarraLateral {...sidebarProps} />
      <Switch>
        <Route exact path='/'>
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
                  onClick={() => history.push('/internship-intention')}>
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
                  onClick={() => history.push('/applications')}>
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
                  onClick={() => history.push('/internship-assessment')}>
                  <CardHeader color='danger' stats icon>
                    <CardIcon color='danger'>
                      <AssignmentIcon />
                    </CardIcon>
                    <p className={classes.cardCategory}>Informes pendientes</p>
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
                    <CareerSelector
                      careerId={careerId}
                      setCareerId={setCareerId}
                    />
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

            {/*<Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <Card>
                  <CardHeader color='info' icon>
                    <CardIcon color='info'>
                      <MdEqualizer />
                    </CardIcon>
                    <p className={classes.cardCategory}>MultiType Chart</p>
                  </CardHeader>
                  <CardBody>
                    <MultiTypeChart />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdFileDownload />
                      Exportar datos
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card>
                  <CardHeader color='danger' icon>
                    <CardIcon color='danger'>
                      <MdTimeline />
                    </CardIcon>
                    <p className={classes.cardCategory}>Line Chart</p>
                  </CardHeader>
                  <CardBody>
                    <LineChart />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdFileDownload />
                      Exportar datos
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
            </Grid>*/}
          </Container>
        </Route>
        <Route exact path='/applications'>
          <ApplicationsList />
        </Route>
        <Route path='/edit-form'>
          <EditForm />
        </Route>
        <Route path='/applications/:applicationId'>
          <FormCheck />
        </Route>
        <Route path='/import'>
          <ImportStudents />
        </Route>
        <Route path='/internship-intention'>
          <InternshipIntention />
        </Route>
        <Route path='/insurance-list'>
          <Insurance />
        </Route>
        <Route exact path='/internship-assessment'>
          <ReportsList />
        </Route>
        <Route path='/internship-assessment/:studentId/:internshipId'>
          <AssessReport />
        </Route>
        <Route path='/extension-list/'>
          <ExtensionList />
        </Route>
        <Route path='/careers-settings'>
          <CareersSettings />
        </Route>
        <Route path='/supervisor-management'>
          <SupervisorManagement />
        </Route>
        <Route exact path='/wip'>
          <Grid container direction='column' alignItems='center' mar>
            <WarningIcon fontSize='large' />
            <Typography variant='h3'>Página en construcción</Typography>
            <Typography color='textSecondary'>
              Estamos trabajando para usted
            </Typography>
          </Grid>
        </Route>
      </Switch>
    </div>
  );
}

export default DashboardAdmin;
