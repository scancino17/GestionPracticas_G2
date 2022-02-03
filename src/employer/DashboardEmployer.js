import {
  Hidden,
  Typography,
  Grid,
  Container,
  Accordion,
  makeStyles,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useEmployer } from '../providers/Employer';
import { useUser } from '../providers/User';
import rutFormatter from '../utils/RutFormatter';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  bold: {
    fontWeight: 600
  }
}));

function InternItem({ internship, expanded, changeExpanded }) {
  const classes = useStyles();

  const {
    internshipId,
    studentName,
    studentRut,
    studentCareer,
    internStart,
    internEnd
  } = internship;

  function toLegibleDate(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-CL');
  }

  return (
    <>
      <Accordion
        expanded={expanded === internshipId}
        onChange={changeExpanded(internshipId)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>{studentName}</Typography>
          <Typography className={classes.secondaryHeading}>
            {studentCareer}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
              <Typography variant='h6'>Detalles de practicante</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Nombre:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{studentName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Rut:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{rutFormatter(studentRut)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Carrera:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{studentCareer}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Fecha de inicio:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{toLegibleDate(internStart)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Fecha de término:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{toLegibleDate(internEnd)}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button color='primary' onClick={() => console.log('boop')}>
            Responder evaluación
          </Button>
        </AccordionActions>
      </Accordion>
    </>
  );
}

function DashboardEmployer() {
  const { displayName } = useUser();
  const { employerLoaded, internList } = useEmployer();
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  useEffect(() => {
    if (internList.length === 1) setExpanded(internList[0].internshipId);
  }, [internList]);

  return (
    <Routes>
      <Route
        exact
        path='/'
        element={
          <>
            <Hidden smDown>
              <Grid
                style={{
                  backgroundImage: "url('HomeBanner-3x.png')",
                  backgroundColor: '#e0f3f7',
                  backgroundSize: '100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  padding: '2rem'
                }}>
                <Typography variant='h4'>
                  ¡Bienvenido/a, {displayName}!
                </Typography>
                <Typography variant='h5'>
                  Evaluación de desempeño de practicantes
                </Typography>
              </Grid>
            </Hidden>
            {employerLoaded ? (
              internList.length ? (
                <Container style={{ marginTop: '2rem' }}>
                  {internList.map((internship, index) => (
                    <InternItem
                      key={index}
                      internship={internship}
                      expanded={expanded}
                      changeExpanded={changeExpanded}
                    />
                  ))}
                </Container>
              ) : (
                <Typography>
                  Nada que ver por aquí. ¡Vuelve más tarde!
                </Typography>
              )
            ) : (
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                direction='column'
                style={{ marginTop: '4rem' }}>
                <Skeleton
                  variant='rect'
                  animation='wave'
                  height='5rem'
                  width='75%'
                  style={{ marginBottom: '2rem' }}
                />
                <Skeleton animation='wave' width='75%' height='2rem' />
                <Skeleton animation='wave' width='75%' height='2rem' />
                <Skeleton animation='wave' width='75%' height='2rem' />
              </Grid>
            )}
          </>
        }
      />
    </Routes>
  );
}

export default DashboardEmployer;
