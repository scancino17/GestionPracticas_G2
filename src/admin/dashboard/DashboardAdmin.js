import Card from './extras/Card/Card';
import CardHeader from './extras/Card/CardHeader.js';
import CardIcon from './extras/Card/CardIcon.js';
import CardFooter from './extras/Card/CardFooter.js';
import {
  MdAccessibility,
  MdStore,
  MdUpdate,
  MdInfoOutline,
  MdContentCopy
} from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import useAuth from '../../providers/Auth';
import { Route, Switch } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../layout/BarraLateral';
import Application from '../applications/Application';

import CountUp from 'react-countup';

import { db } from '../../firebase';

import styles from './extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import EditForm from '../../dynamicForm/EditForm';

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
          </Container>
        </Route>
        <Route exact path='/applications'>
          <ApplicationsList applications={pendingApplications} />
        </Route>
        <Route path='/applications/:id'>
          <Application />
        </Route>
        <Route path='/edit-form/:careerId'>
          <EditForm />
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
