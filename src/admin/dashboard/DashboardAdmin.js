import Card from './extras/Card/Card';
import CardHeader from './extras/Card/CardHeader.js';
import CardBody from './extras/Card/CardBody.js';
import CardIcon from './extras/Card/CardIcon.js';
import CardFooter from './extras/Card/CardFooter.js';

import {
  MdUpdate,
  MdTimeline,
  MdMultilineChart,
  MdEqualizer,
  MdPieChart,
  MdTrackChanges,
  MdDonutLarge,
  MdPublic
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
import InternshipIntention from '../internship/InternshipIntention';
import styles from './extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import EditForm from '../../dynamicForm/EditForm';
import FormCheck from '../../dynamicForm/FormCheck';
import VerticalBar from './extras/charts/VerticalBar';
import PieChart from './extras/charts/PieChart';
import TableChart from './extras/charts/TableChart';
import GroupedBarChart from './extras/charts/GroupedBarChart';
import LineChart from './extras/charts/LineChart';
import MultiTypeChart from './extras/charts/MultiTypeChart';
import ImportStudents from '../import/ImportStudents';
import { db } from '../../firebase';
import { pendingIntention } from '../../InternshipStates';
import ImportPracticeInsurance from '../import/ImportPracticeInsurance';
import CareerSelector from '../../utils/CareerSelector';
import PracticeReport from '../evaluatePractice/PracticeReport';
import ReportEvaluate from '../evaluatePractice/ReportEvaluate';
import CareersSettings from '../careersSettings/CareersSettings';
import SupervisorManagement from '../supervisorManagement/SupervisorManagement';

function DashboardAdmin({ sidebarProps }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const history = useHistory();
  const [intentionsCount, setIntentionsCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [careerId, setCareerId] = useState('3407');

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
                    <h3 className={classes.cardTitle}>
                      <CountUp end={intentionsCount} duration={3} />
                    </h3>
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
                    <h3 className={classes.cardTitle}>
                      <CountUp end={formsCount} duration={3} />
                    </h3>
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
                  <CardHeader color='danger' stats icon>
                    <CardIcon color='danger'>
                      <AssignmentIcon />
                    </CardIcon>
                    <p className={classes.cardCategory}>Informes pendientes</p>
                    <h3 className={classes.cardTitle}>
                      <CountUp end={10} duration={3} />
                    </h3>
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
                    <h3 className={classes.cardTitle}>
                      <CountUp end={1000} duration={3} />
                    </h3>
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
                  <GroupedBarChart />
                </CardBody>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <MdUpdate />
                    Actualizado recientemente
                  </div>
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
                    <VerticalBar />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdUpdate />
                      Actualizado recientemente
                    </div>
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
                      excludeGeneral
                    />
                  </CardHeader>
                  <CardBody>
                    <PieChart careerId={careerId} />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdUpdate />
                      Actualizado recientemente
                    </div>
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
                  <TableChart />
                </CardBody>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <MdUpdate />
                    Actualizado recientemente
                  </div>
                </CardFooter>
              </Card>
            </Grid>

            <Grid container spacing={3}>
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
                      <MdUpdate />
                      Actualizado recientemente
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
                      <MdUpdate />
                      Actualizado recientemente
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
            </Grid>
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
          <ImportPracticeInsurance />
        </Route>
        <Route path='/internship-evaluation'>
          <PracticeReport />
        </Route>
        <Route path='/report-evaluated/:studentId/:internshipId'>
          <ReportEvaluate />
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
