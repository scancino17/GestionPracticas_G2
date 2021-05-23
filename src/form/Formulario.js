import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import useAuth from '../providers/Auth';
import {
  Button,
  Grid,
  StepLabel,
  Stepper,
  Step,
  Typography,
  TextField,
  MenuItem
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

function Formulario() {
  const { internshipId } = useParams();
  const { user, userData } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [applicationNumber, setApplicationNumber] = useState();
  const [form, setForm] = useState({
    studentId: user.uid,
    internshipId: internshipId,
    applicationNumber: applicationNumber,
    status: 'En revisión',
    name: userData.name,
    rut: userData.rut,
    enrollmentNumber: userData.enrollmentNumber,
    phone: '',
    email: userData.email,
    emergencyContact: '',
    emergencyPhone: '',
    companyName: '',
    city: '',
    supervisorName: '',
    supervisorPosition: '',
    supervisorPhone: '',
    supervisorEmail: '',
    modality: '',
    healthCare: '',
    startDate: '',
    endDate: ''
  });
  const [formFile, setFormFile] = useState();
  const [consentFile, setConsentFile] = useState();
  const steps = [
    { label: 'Información personal' },
    { label: 'Información de la empresa' },
    { label: 'Archivos' }
  ];
  const healthCareOptions = ['Isapre', 'Fonana', 'No sabe'];
  const modalityOptions = ['Presencial, Mixta, Online'];

  useEffect(() => {
    db.collection('internships')
      .doc(internshipId)
      .get()
      .then((doc) => {
        setApplicationNumber(doc.data().applicationNumber);
        setForm((prevForm) => ({
          ...prevForm,
          applicationNumber: doc.data().applicationNumber
        }));
      });
  }, [internshipId]);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  function handleFormFileInput(files) {
    setFormFile(files[0]);
  }

  function handleConsentFileInput(files) {
    setConsentFile(files[0]);
  }

  const handleEnviar = () => {
    db.collection('applications').add(form);
    storage
      .ref()
      .child(`students-docs/${user.uid}/${applicationNumber}/${formFile.name}`)
      .put(formFile);
    storage
      .ref()
      .child(`students-docs/${user.uid}/${internshipId}/${consentFile.name}`)
      .put(consentFile);
    /*db.collection('internships')
      .doc(internshipId)
      .update({ status: 'En revisión' });*/
  };

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Grid
          item
          container
          justify='center'
          direction='row'
          alignItems='center'
          xs={12}>
          <Grid item container xs={9} justify='center'>
            <Typography variant='h1'>Información personal</Typography>
            <form>
              <TextField
                id='name'
                name='name'
                label='Nombre completo'
                value={form.name}
                disabled
                InputLabelProps={{ htmlFor: 'name' }}
              />
              <TextField
                id='rut'
                name='rut'
                label='RUT'
                value={form.rut}
                disabled
                InputLabelProps={{ htmlFor: 'rut' }}
              />
              <TextField
                id='enrollment'
                name='enrollment'
                label='Número de matrícula'
                value={form.enrollmentNumber}
                disabled
                InputLabelProps={{ htmlFor: 'enrollment' }}
              />
              <TextField
                id='phone'
                name='phone'
                label='Teléfono'
                value={form.phone}
                InputLabelProps={{ htmlFor: 'phone' }}
                onChange={(e) =>
                  setForm((prevState) => ({
                    ...prevState,
                    phone: e.target.value
                  }))
                }
              />
              <TextField
                id='email'
                name='email'
                label='Correo'
                value={form.email}
                disabled
                InputLabelProps={{ htmlFor: 'email' }}
              />
              <TextField
                id='emergency-contact'
                name='emergency-contact'
                label='Nombre contacto de emergencia'
                value={form.emergencyContact}
                InputLabelProps={{ htmlFor: 'emergency-contact' }}
                onChange={(e) =>
                  setForm((prevState) => ({
                    ...prevState,
                    emergencyContact: e.target.value
                  }))
                }
              />
              <TextField
                id='emergency-phone'
                name='emergency-phone'
                label='Teléfono de emergencia'
                value={form.emergencyPhone}
                InputLabelProps={{ htmlFor: 'emergency-phone' }}
                onChange={(e) =>
                  setForm((prevState) => ({
                    ...prevState,
                    emergencyPhone: e.target.value
                  }))
                }
              />
              <TextField
                id='healthcare'
                name='healthcare'
                label='Seguro de salud'
                value={form.healthCare}
                select
                InputLabelProps={{ htmlFor: 'healthcare' }}>
                onChange=
                {(event) =>
                  setForm((prevState) => ({
                    ...prevState,
                    helthCare: event.target.value
                  }))
                }
                {healthCareOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <>
          <Grid item container justify='center' direction='row' xs={12}>
            <Grid item container xs={9} justify='center'>
              <Typography variant='h1'>Información de la empresa</Typography>
              <form>
                <TextField
                  id='company-name'
                  name='company-name'
                  label='Nombre de la empresa'
                  value={form.companyName}
                  InputLabelProps={{ htmlFor: 'company-name' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      companyName: e.target.value
                    }))
                  }
                />
                <TextField
                  id='city'
                  name='city'
                  label='Ciudad donde se realizará la práctica'
                  value={form.city}
                  InputLabelProps={{ htmlFor: 'city' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      city: e.target.value
                    }))
                  }
                />
              </form>
              <Typography variant='h1'>Información del supervisor</Typography>
              <form>
                <TextField
                  id='supervisor-name'
                  name='supervisor-name'
                  label='Nombre completo del supervisor'
                  value={form.supervisorName}
                  InputLabelProps={{ htmlFor: 'supervisor-name' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      supervisorName: e.target.value
                    }))
                  }
                />
                <TextField
                  id='supervisor-position'
                  name='supervisor-position'
                  label='Cargo del supervisor'
                  value={form.supervisorPosition}
                  InputLabelProps={{ htmlFor: 'supervisor-position' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      supervisorPosition: e.target.value
                    }))
                  }
                />
                <TextField
                  id='supervisor-phone'
                  name='supervisor-phone'
                  label='Cargo del supervisor'
                  value={form.supervisorPhone}
                  InputLabelProps={{ htmlFor: 'supervisor-phone' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      supervisorPhone: e.target.value
                    }))
                  }
                />
                <TextField
                  id='supervisor-email'
                  name='supervisor-email'
                  label='Correo del supervisor'
                  value={form.supervisorEmail}
                  InputLabelProps={{ htmlFor: 'supervisor-email' }}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      supervisorEmail: e.target.value
                    }))
                  }
                />
              </form>
              <Typography variant='h1'>Acerca de la práctica</Typography>
              <form>
                <TextField
                  id='application-number'
                  name='application-number'
                  label='Número de práctica'
                  value={`Práctica ${form.applicationNumber}`}
                  disabled
                  InputLabelProps={{ htmlFor: 'application-number' }}
                />
                <TextField
                  id='modality'
                  name='modality'
                  label='Modalidad'
                  value={form.modality}
                  select
                  InputLabelProps={{ htmlFor: 'modality' }}>
                  onChange=
                  {(event) =>
                    setForm((prevState) => ({
                      ...prevState,
                      modality: event.target.value
                    }))
                  }
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
                  value={form.startDate}
                  InputLabelProps={{ htmlFor: 'start-date' }}
                  type='date'
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      startDate: e.target.value
                    }))
                  }
                />
                <TextField
                  id='end-date'
                  name='end-date'
                  label='Fecha de término de práctica'
                  value={form.startDate}
                  InputLabelProps={{ htmlFor: 'end-date' }}
                  type='date'
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      endDate: e.target.value
                    }))
                  }
                />
              </form>
            </Grid>
          </Grid>
        </>
      )}

      {activeStep === 2 && (
        <>
          <Typography variant='h1'>Archivos</Typography>
          <Typography variant='h2'>
            Formulario de inscripción de práctica
          </Typography>
          <DropzoneArea filesLimit={1} onChange={handleFormFileInput} />
          <Typography variant='h2'>Consentimiento informado</Typography>
          <DropzoneArea filesLimit={1} onChange={handleConsentFileInput} />
        </>
      )}

      <Grid
        item
        container
        align='center'
        alignItems='center'
        justify='center'
        xs={12}>
        <Grid
          item
          container
          direction='row'
          alignItems='center'
          xs={12}
          justify='center'>
          {activeStep > 0 && (
            <Grid item xs={2}>
              <Button color='primary' onClick={handleBack}>
                Volver
              </Button>
            </Grid>
          )}
          {((activeStep === 0 &&
            !(
              form.name === '' ||
              form.rut === '' ||
              form.enrollmentNumber === '' ||
              form.phone === '' ||
              form.email === '' ||
              form.emergencyContact === '' ||
              form.emergencyPhone === '' ||
              form.healthCare === ''
            )) ||
            (activeStep === 1 &&
              !(
                form.companyName === '' ||
                form.city === '' ||
                form.supervisorName === '' ||
                form.supervisorPosition === '' ||
                form.supervisorPhone === '' ||
                form.supervisorEmail === '' ||
                form.modality === '' ||
                form.startDate === '' ||
                form.endDate === ''
              ))) && (
            <Grid item xs={2}>
              <Button color='primary' onClick={handleNext}>
                Siguiente
              </Button>
            </Grid>
          )}
          {activeStep === 2 && (
            <Grid item xs={2}>
              <Link to='/'>
                <Button
                  onClick={handleEnviar}
                  variant='contained'
                  color='primary'>
                  Enviar
                </Button>
              </Link>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Formulario;
