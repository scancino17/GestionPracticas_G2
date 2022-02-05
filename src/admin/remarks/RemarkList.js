import {
  makeStyles,
  Grid,
  Typography,
  Container,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Hidden,
  Button
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { useMemo, useState } from 'react';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser, DEFAULT_CAREER, ADMIN_ROLE } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    [theme.breakpoints.up('sm')]: { flexBasis: '33.33%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('sm')]: { flexBasis: '66.66%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  bold: {
    fontWeight: 600
  }
}));

function RemarkItem({ remark, expanded, changeExpanded }) {
  const classes = useStyles();

  return (
    <>
      <Accordion
        expanded={expanded === remark.index}
        onChange={changeExpanded(remark.index)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>
            {remark.employerName}
          </Typography>
          <Hidden xsDown>
            <Typography className={classes.secondaryHeading}>
              {`Observación de Practica ${remark.internshipNumber} de ${remark.studentName}`}
            </Typography>
          </Hidden>
          <Hidden smUp>
            <Typography className={classes.secondaryHeading}>
              {`${remark.studentName}`}
            </Typography>
          </Hidden>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
              <Typography variant='h6'>Detalles de practicante</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Nombre estudiante:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.studentName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Carrera:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.careerName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Nombre supervisor:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.employerName}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className={classes.bold}>
                Correo de supervisor:
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{remark.employerEmail}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '1rem' }}>
              <Typography className={classes.bold}>Observación:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{remark.remark}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button color='primary'>Marcar como leído</Button>
          <Button color='primary'>Responder observación</Button>
        </AccordionActions>
      </Accordion>
    </>
  );
}

function RemarkList() {
  const { userRole } = useUser();
  const { remarkList } = useSupervisor();
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [expanded, setExpanded] = useState();

  const changeExpanded = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  const filteredRemarkList = useMemo(() => {
    return remarkList
      .slice()
      .filter(
        (item) =>
          selectedCareerId === DEFAULT_CAREER ||
          item.careerId === selectedCareerId
      )
      .filter(
        (item) =>
          name === '' ||
          item.studentName.includes(name) ||
          item.employerName.includes(name)
      );
  }, [name, remarkList, selectedCareerId]);

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
        <Typography variant='h4'>Observaciones de empleadores</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid
          container
          justifyContent='flex-end'
          alignItems='center'
          spacing={4}>
          <Grid item>
            <TextField
              label='Buscar por nombre'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          {userRole === ADMIN_ROLE && (
            <Grid item>
              <CareerSelector
                careerId={selectedCareerId}
                setCareerId={setSelectedCareerId}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filteredRemarkList.length > 0 ? (
          <Container style={{ marginTop: '2rem' }}>
            {filteredRemarkList.map((remark) => (
              <RemarkItem
                key={remark.index}
                remark={remark}
                expanded={expanded}
                changeExpanded={changeExpanded}
              />
            ))}
          </Container>
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
                alt='Sin observaciones disponibles'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay observaciones de empleadores disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

export default RemarkList;
