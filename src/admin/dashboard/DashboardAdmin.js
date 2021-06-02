import Card from './extras/Card/Card';
import CardHeader from './extras/Card/CardHeader.js';
import CardBody from './extras/Card/CardBody.js';
import CardIcon from './extras/Card/CardIcon.js';
import CardFooter from './extras/Card/CardFooter.js';
import {
  MdAccessibility,
  MdStore,
  MdUpdate,
  MdInfoOutline,
  MdContentCopy,
  MdTimeline,
  MdMultilineChart,
  MdEqualizer,
  MdPieChart,
  MdTrackChanges,
  MdDonutLarge
} from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import useAuth from '../../providers/Auth';
import { Route, Switch } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../layout/BarraLateral';
import Application from '../applications/Application';

import CountUp from 'react-countup';

import { db } from '../../firebase';
import InternshipIntention from '../internship/InternshipIntention';

import styles from './extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import EditForm from '../../dynamicForm/EditForm';
import FormCheck from '../../dynamicForm/FormCheck';
import VerticalBar from './extras/charts/VerticalBar';
import PieChart from './extras/charts/PieChart';
import RadarChart from './extras/charts/RadarChart';
import PolarChart from './extras/charts/PolarChart';
import DoughnutChart from './extras/charts/DoughnutChart';
import GroupedBarChart from './extras/charts/GroupedBarChart';
import LineChart from './extras/charts/LineChart';
import MultiTypeChart from './extras/charts/MultiTypeChart';
import ImportStudents from '../import/ImportStudents';

const useStyles = makeStyles(styles);

function DashboardAdmin({ sidebarProps }) {
  const { user, userData } = useAuth();
  const [applications, setApplications] = useState();
  const [pendingApplications, setPendingApplications] = useState();

  const updateApplications = () => {
    db.collection('applications').onSnapshot((querySnapshot) => {
      var list = [];
      querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setApplications(list);
      const pending = list.filter((item) => item.status === 'En revisión');
      setPendingApplications(pending);
    });
  };

  useEffect(() => {
    updateApplications();
  }, []);

  const classes = useStyles();

  return (
    <div style={{ display: 'flex' }}>
      <BarraLateral {...sidebarProps} />
      <Switch>
        <Route exact path='/'>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader color='warning' stats icon>
                    <CardIcon color='warning'>
                      <MdContentCopy />
                    </CardIcon>
                    <p className={classes.cardCategory}>Nuevas Declaraciones</p>
                    <h3 className={classes.cardTitle}>
                      <CountUp end={100} duration={3} />
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
                  <CardHeader color='success' stats icon>
                    <CardIcon color='success'>
                      <MdStore />
                    </CardIcon>
                    <p className={classes.cardCategory}>Nuevos Formularios</p>
                    <h3 className={classes.cardTitle}>
                      <CountUp end={50} duration={3} />
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
                      <MdInfoOutline />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Formularios Corregidos
                    </p>
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
                      <MdAccessibility />
                    </CardIcon>
                    <p className={classes.cardCategory}>Prácticas en Marcha</p>
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

            {/*Charts*/}
            <Grid>
              <Card>
                <CardHeader color='rose' icon>
                  <CardIcon color='rose'>
                    <MdMultilineChart />
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

            <Grid container spacing={3}>
              <Grid item xs={12} sm={8} md={8}>
                <Card>
                  <CardHeader color='warning' icon>
                    <CardIcon color='warning'>
                      <MdEqualizer />
                    </CardIcon>
                    <p className={classes.cardCategory}>Single Bars Chart</p>
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
                    <p className={classes.cardCategory}>Pie Chart</p>
                  </CardHeader>
                  <CardBody>
                    <PieChart />
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

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader color='danger' icon>
                    <CardIcon color='danger'>
                      <MdTrackChanges />
                    </CardIcon>
                    <p className={classes.cardCategory}>Radar Chart</p>
                  </CardHeader>
                  <CardBody>
                    <RadarChart />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdUpdate />
                      Actualizado recientemente
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader color='success' icon>
                    <CardIcon color='success'>
                      <MdDonutLarge />
                    </CardIcon>
                    <p className={classes.cardCategory}>Doughnut Chart</p>
                  </CardHeader>
                  <CardBody>
                    <DoughnutChart />
                  </CardBody>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <MdUpdate />
                      Actualizado recientemente
                    </div>
                  </CardFooter>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader color='warning' icon>
                    <CardIcon color='warning'>
                      <MdTrackChanges />
                    </CardIcon>
                    <p className={classes.cardCategory}>Polar Chart</p>
                  </CardHeader>
                  <CardBody>
                    <PolarChart />
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

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <Card>
                  <CardHeader color='info' icon>
                    <CardIcon color='info'>
                      <MdEqualizer />
                    </CardIcon>
                    <p className={classes.cardCategory}>Grouped Bars Chart</p>
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
          <ApplicationsList applications={pendingApplications} />
        </Route>
        <Route path='/applications/:id'>
          <Application />
        </Route>
        <Route path='/edit-form'>
          <EditForm />
        </Route>
        <Route path='/check-form/:careerId'>
          <FormCheck />
        </Route>
        <Route path='/import'>
          <ImportStudents />
        </Route>
        <Route path='/internship-intention'>
          <Container className={classes.content}>
            <InternshipIntention />
          </Container>
        </Route>
        <Route exact path='/wip'>
          <Grid container direction='column' alignItems='center' mar>
            <WarningIcon fontSize='large' />
            <Typography variant='h3'>Página no encontrada!</Typography>
            <Typography color='textSecondary'>Esta página no existe</Typography>
          </Grid>
        </Route>
      </Switch>
    </div>
  );
}

export default DashboardAdmin;
