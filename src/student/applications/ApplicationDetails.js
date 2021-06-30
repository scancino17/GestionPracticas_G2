import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Documentos from '../extras/Documentos';
import { db, storage } from '../../firebase';
import {
  CircularProgress,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    // Este flex: auto está aqui para que los form abajo puedan ocupar todo el tamaño del grid que los contiene
    // El '& .MuiTextField-root' tiene básicamente la misma funcionalidad.
    flex: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  topBottomPadding: {
    paddingTop: '1rem',
    paddingBottom: '1rem'
  }
}));

function ApplicationDetails() {
  const classes = useStyles();
  const { applicationId } = useParams();
  const [application, setApplication] = useState();
  const [docs, setDocs] = useState();
  const healthCareOptions = ['Isapre', 'Fonasa', 'No sabe'];
  const modalityOptions = ['Presencial', 'Mixta', 'Online'];

  useEffect(() => {
    db.collection('applications')
      .doc(applicationId)
      .get()
      .then((doc) => {
        setApplication(doc.data());
      });
  }, [applicationId]);

  useEffect(() => {
    if (application)
      storage
        .ref(
          `students-docs/${application.studentId}/${application.internshipId}`
        )
        .listAll()
        .then((res) => setDocs(res.items));
  }, [application]);

  const CenteredTypography = ({ typographyProps, text }) => (
    <Grid
      className={classes.topBottomPadding}
      item
      xs={12}
      container
      justify='center'
      alignItems='center'>
      <Typography {...typographyProps}>{text}</Typography>
    </Grid>
  );

  return (
    <Grid
      item
      xs={12}
      container
      justify='center'
      alignItems='center'
      direction='column'>
      {application && docs ? (
        <Grid
          item
          xs={9}
          container
          justify='center'
          alignItems='center'
          direction='column'>
          <form className={classes.root}>
            <CenteredTypography
              text='Detalles de solicitud'
              typographyProps={{ variant: 'h2' }}
            />
            <CenteredTypography
              text='Información personal'
              typographyProps={{ variant: 'h3' }}
            />
            <TextField
              id='name'
              name='name'
              label='Nombre completo'
              value={application.name}
              disabled
              InputLabelProps={{ htmlFor: 'name' }}
            />
            <TextField
              id='rut'
              name='rut'
              label='RUT'
              value={application.rut}
              disabled
              InputLabelProps={{ htmlFor: 'rut' }}
            />
            <TextField
              id='enrollment'
              name='enrollment'
              label='Número de matrícula'
              value={application.enrollmentNumber}
              disabled
              InputLabelProps={{ htmlFor: 'enrollment' }}
            />
            <TextField
              id='phone'
              name='phone'
              label='Teléfono'
              value={application.phone}
              disabled
              InputLabelProps={{ htmlFor: 'phone' }}
            />
            <TextField
              id='email'
              name='email'
              label='Correo'
              value={application.email}
              disabled
              InputLabelProps={{ htmlFor: 'email' }}
            />
            <TextField
              id='emergency-contact'
              name='emergency-contact'
              label='Nombre contacto de emergencia'
              value={application.emergencyContact}
              disabled
              InputLabelProps={{ htmlFor: 'emergency-contact' }}
            />
            <TextField
              id='emergency-phone'
              name='emergency-phone'
              label='Teléfono de emergencia'
              value={application.emergencyPhone}
              disabled
              InputLabelProps={{ htmlFor: 'emergency-phone' }}
            />
            <TextField
              id='healthcare'
              name='healthcare'
              label='Seguro de salud'
              value={application.healthCare}
              select
              disabled
              InputLabelProps={{ htmlFor: 'healthcare' }}>
              {healthCareOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <CenteredTypography
              text='Información de la empresa'
              typographyProps={{ variant: 'h3' }}
            />
            <TextField
              id='company-name'
              name='company-name'
              label='Nombre de la empresa'
              value={application.companyName}
              disabled
              InputLabelProps={{ htmlFor: 'company-name' }}
            />
            <TextField
              id='city'
              name='city'
              label='Ciudad donde se realizará la práctica'
              value={application.city}
              disabled
              InputLabelProps={{ htmlFor: 'city' }}
            />
            <CenteredTypography
              text='Información del supervisor'
              typographyProps={{ variant: 'h3' }}
            />
            <TextField
              id='supervisor-name'
              name='supervisor-name'
              label='Nombre completo del supervisor'
              value={application.supervisorName}
              disabled
              InputLabelProps={{ htmlFor: 'supervisor-name' }}
            />
            <TextField
              id='supervisor-position'
              name='supervisor-position'
              label='Cargo del supervisor'
              value={application.supervisorPosition}
              disabled
              InputLabelProps={{ htmlFor: 'supervisor-position' }}
            />
            <TextField
              id='supervisor-phone'
              name='supervisor-phone'
              label='Teléfono del supervisor'
              value={application.supervisorPhone}
              disabled
              InputLabelProps={{ htmlFor: 'supervisor-phone' }}
            />
            <TextField
              id='supervisor-email'
              name='supervisor-email'
              label='Correo del supervisor'
              value={application.supervisorEmail}
              disabled
              InputLabelProps={{ htmlFor: 'supervisor-email' }}
            />
            <CenteredTypography
              text='Acerca de la práctica'
              typographyProps={{ variant: 'h3' }}
            />
            <TextField
              id='application-number'
              name='application-number'
              label='Número de práctica'
              value={`Práctica ${application.internshipNumber}`}
              disabled
              InputLabelProps={{ htmlFor: 'application-number' }}
            />
            <TextField
              id='modality'
              name='modality'
              label='Modalidad'
              value={application.modality}
              select
              disabled
              InputLabelProps={{ htmlFor: 'modality' }}>
              {modalityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id='start-date'
              name='start-date'
              label='Fecha de inicio de práctica'
              value={application.startDate}
              disabled
              InputLabelProps={{ htmlFor: 'start-date' }}
              type='date'
            />
            <TextField
              id='end-date'
              name='end-date'
              label='Fecha de término de práctica'
              value={application.endDate}
              disabled
              InputLabelProps={{ htmlFor: 'end-date' }}
              type='date'
            />
          </form>
          {application.status === 'Rechazado' && (
            <>
              <Grid
                item
                xs={12}
                container
                justify='center'
                alignItems='center'
                direction='row'>
                <Grid item xs={6}>
                  <CenteredTypography
                    text='Estado de solicitud: '
                    typographyProps={{ variant: 'h5' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CenteredTypography
                    text={application.status}
                    typographyProps={{ variant: 'h5' }}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                justify='center'
                alignItems='center'
                direction='row'>
                <CenteredTypography
                  text='Razón de Rechazo'
                  typographyProps={{ variant: 'h4' }}
                />
                <CenteredTypography
                  text={application.reason}
                  typographyProps={{ variant: 'body1' }}
                />
              </Grid>
            </>
          )}
          <Grid
            item
            xs={12}
            container
            justify='center'
            alignItems='center'
            direction='column'>
            <CenteredTypography
              text='Archivos Adjuntos'
              typographyProps={{ variant: 'h3' }}
            />
            <Documentos docs={docs} />
          </Grid>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

export default ApplicationDetails;
