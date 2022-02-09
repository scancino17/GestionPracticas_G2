import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployer } from './../providers/Employer';
import { toLegibleDate, toLegibleTime } from '../utils/FormatUtils';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  bold: {
    fontWeight: 600
  },
  mediumText: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'medium'
  },
  card: {
    marginBottom: '1rem',
    '&:not(:first-child)': {
      marginTop: '3rem'
    }
  },
  secondaryCard: {
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: '3rem'
  },
  readHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#5DC2E9',
    fontWeight: 'bold'
  }
}));

function RemarksList({ remarksList }) {
  const reversedList = remarksList.slice().reverse();
  return (
    <Container style={{ marginTop: '2rem' }}>
      {reversedList.map((remark) => (
        <RemarkItem key={remark.id} remark={remark} />
      ))}
    </Container>
  );
}

function RemarkItem({ remark }) {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography
              className={
                classes.heading
              }>{`Observación enviada el ${toLegibleDate(
              remark.remarkTime
            )} ${toLegibleTime(remark.remarkTime)}`}</Typography>
            {remark.read ? (
              <Typography className={classes.readHeading}>Leído</Typography>
            ) : (
              <Typography className={classes.mediumText}>No Leído</Typography>
            )}
          </Grid>
          <Typography style={{ marginTop: '.1rem' }}>
            {remark.remark}
          </Typography>
        </CardContent>
      </Card>
      {remark.read && (
        <Card className={classes.secondaryCard}>
          <CardContent>
            <Typography className={classes.heading}>{`${
              remark.answer ? 'Respuesta envíada' : 'Mensaje recibido'
            } el ${toLegibleDate(remark.updateTime)} ${toLegibleTime(
              remark.updateTime
            )}`}</Typography>
            {remark.answer && (
              <Typography style={{ marginTop: '.1rem', marginBottom: '.3rem' }}>
                {remark.answer}
              </Typography>
            )}
            <Grid
              container
              direction='row'
              justifyContent='space-between'
              alignItems='center'>
              <Typography className={classes.mediumText}>
                {`${remark.answer ? 'Mensaje enviado' : 'Recibido'} por ${
                  remark.evaluatingSupervisor.name
                }`}
              </Typography>
              <Typography className={classes.mediumText}>
                {remark.evaluatingSupervisor.email}
              </Typography>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function RemarkHistory() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const { remarksMap, getInternData } = useEmployer();

  const remarksList = useMemo(
    () => (internshipId && remarksMap ? remarksMap.get(internshipId) : []),
    [remarksMap, internshipId]
  );

  const internData = useMemo(
    () => getInternData(internshipId),
    [getInternData, internshipId]
  );

  return remarksList && remarksList.length && internData ? (
    <>
      <Grid container direction='column'>
        <div
          style={{
            backgroundImage: "url('../HomeBanner-3x.png')",
            backgroundColor: '#e0f3f7',
            backgroundSize: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            padding: '2rem'
          }}>
          <Typography variant='h4'>Historial de observaciones</Typography>
          <Typography variant='h6'>{`Observaciones del estudiante ${internData.studentName}`}</Typography>
        </div>
        <RemarksList remarksList={remarksList} />
        <Container>
          <Grid
            container
            justifyContent='flex-end'
            style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Grid item xs={8} sm={6} md={3} lg={2}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={() => navigate('/')}>
                Regresar
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  ) : (
    <LoadingSkeleton />
  );
}

function LoadingSkeleton() {
  return (
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
  );
}

export default RemarkHistory;
