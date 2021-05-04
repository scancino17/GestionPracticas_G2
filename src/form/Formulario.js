import React, { useEffect, useState } from 'react';
import { Stepper } from 'react-form-stepper';
import {
  Button,
  Form,
  FormField,
  TextInput,
  Box,
  Select,
  DateInput,
  FileInput
} from 'grommet';
import { Link, useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import useAuth from '../providers/Auth';

function Formulario() {
  const { internshipId } = useParams();
  const { user, userData } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [applicationNumber, setApplicationNumber] = useState();
  const [form, setForm] = useState({
    studentId: user.uid,
    internshipId: internshipId,
    applicationNumber: applicationNumber,
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

  function handleFormFileInput(e) {
    setFormFile(e.target.files[0]);
  }

  function handleConsentFileInput(e) {
    setConsentFile(e.target.files[0]);
  }

  const handleEnviar = () => {
    db.collection('applications').add(form);
    storage
      .ref()
      .child(`students-docs/${user.uid}/${applicationNumber}/${formFile.name}`)
      .put(formFile);
    storage
      .ref()
      .child(
        `students-docs/${user.uid}/${applicationNumber}/${consentFile.name}`
      )
      .put(consentFile);
    db.collection('internships')
      .doc(internshipId)
      .update({ status: 'En revisión' });
  };

  return (
    <>
      <Stepper
        steps={[
          { label: 'Información personal' },
          { label: 'Información de la empresa' },
          { label: 'Archivos' }
        ]}
        activeStep={activeStep}
      />

      {activeStep === 0 && (
        <Box justify='center' direction='row-responsive' width='100%'>
          <Box pad='large' width='75%' justify='center'>
            <h1>Información personal</h1>
            <Form>
              <FormField name='name' htmlFor='name' label='Nombre completo'>
                <TextInput id='name' name='name' value={form.name} disabled />
              </FormField>
              <FormField name='rut' htmlFor='rut' label='RUT'>
                <TextInput id='rut' name='rut' value={form.rut} disabled />
              </FormField>
              <FormField
                name='enrollment'
                htmlFor='enrollment'
                label='Numero de matrícula'>
                <TextInput
                  id='enrollment'
                  name='enrollment'
                  value={form.enrollmentNumber}
                  disabled
                />
              </FormField>
              <FormField name='phone' htmlFor='phone' label='Teléfono'>
                <TextInput
                  id='phone'
                  name='phone'
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      phone: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField name='email' htmlFor='email' label='Correo'>
                <TextInput
                  id='email'
                  name='email'
                  type='email'
                  value={form.email}
                  disabled
                />
              </FormField>
              <FormField
                name='emergency-contact'
                htmlFor='emergency-contact'
                label='Nombre Contacto de Emergencia'>
                <TextInput
                  id='emergency-contact'
                  name='emergency-contact'
                  value={form.emergencyContact}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      emergencyContact: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField
                name='emergency-phone'
                htmlFor='emergency-phone'
                label='Teléfono de emergencia'>
                <TextInput
                  id='emergency-phone'
                  name='emergency-phone'
                  value={form.emergencyPhone}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      emergencyPhone: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField
                name='healthcare'
                htmlFor='healthcare'
                label='Seguro de salud'>
                <Select
                  id='healthcare'
                  options={['Fonasa', 'Isapre', 'No sabe']}
                  value={form.healthCare}
                  onChange={({ option }) =>
                    setForm((prevState) => ({
                      ...prevState,
                      healthCare: option
                    }))
                  }
                />
              </FormField>
            </Form>
          </Box>
        </Box>
      )}

      {activeStep === 1 && (
        <>
          <Box justify='center' direction='row-responsive' width='100%'>
            <Box pad='large' width='75%' justify='center'>
              <h1>Informacion de la empresa</h1>
              <Form>
                <FormField
                  name='company-name'
                  htmlFor='company-name'
                  label='Nombre de la empresa'>
                  <TextInput
                    id='company-name'
                    name='company-name'
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        companyName: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='city'
                  htmlFor='city'
                  label='Ciudad donde se realizará la práctica'>
                  <TextInput
                    id='city'
                    name='city'
                    value={form.city}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        city: e.target.value
                      }))
                    }
                  />
                </FormField>
              </Form>
              <h1>Informacion del supervisor</h1>
              <Form>
                <FormField
                  name='supervisor-name'
                  htmlFor='supervisor-name'
                  label='Nombre completo del supervisor'>
                  <TextInput
                    id='supervisor-name'
                    name='supervisorname'
                    value={form.supervisorName}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        supervisorName: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='supervisor-position'
                  htmlFor='supervisor-position'
                  label='Cargo del supervisor'>
                  <TextInput
                    id='supervisor-position'
                    name='supervisor-position'
                    value={form.supervisorPosition}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        supervisorPosition: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='supervisor-phone'
                  htmlFor='supervisor-phone'
                  label='Teléfono del supervisor'>
                  <TextInput
                    id='supervisor-phone'
                    name='supervisor-phone'
                    value={form.supervisorPhone}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        supervisorPhone: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='supervisor-email'
                  htmlFor='supervisor-email'
                  label='Correo del supervisor'>
                  <TextInput
                    id='supervisor-email'
                    name='supervisor-email'
                    type='email'
                    value={form.supervisorEmail}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        supervisorEmail: e.target.value
                      }))
                    }
                  />
                </FormField>
              </Form>
              <h1>Acerca de la práctica</h1>
              <Form>
                <FormField
                  name='application-number'
                  htmlFor='application-number'
                  label='Número de práctica'>
                  <TextInput
                    id='application-number'
                    name='application-number'
                    value={`Práctica ${form.applicationNumber}`}
                    disabled
                  />
                </FormField>
                <FormField name='modality' htmlFor='modality' label='Modalidad'>
                  <Select
                    id='modality'
                    options={['Online', 'Presencial', 'Mixta']}
                    value={form.modality}
                    onChange={({ option }) =>
                      setForm((prevState) => ({
                        ...prevState,
                        modality: option
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='start-date'
                  htmlFor='start-date'
                  label='Fecha de inicio de práctica'>
                  <DateInput
                    id='start-date'
                    name='start-date'
                    format='dd/mm/yyyy'
                    value={form.startDate}
                    onChange={({ value }) => {
                      setForm((prevState) => ({
                        ...prevState,
                        startDate: value
                      }));
                    }}
                  />
                </FormField>
                <FormField
                  name='end-date'
                  htmlFor='end-date'
                  label='Fecha de término de práctica'>
                  <DateInput
                    id='end-date'
                    name='end-date'
                    format='dd/mm/yyyy'
                    value={form.endDate}
                    onChange={({ value }) => {
                      setForm((prevState) => ({
                        ...prevState,
                        endDate: value
                      }));
                    }}
                  />
                </FormField>
              </Form>
            </Box>
          </Box>
        </>
      )}

      {activeStep === 2 && (
        <>
          <h1>Archivos</h1>
          <h2>Formulario de inscipción de práctica</h2>
          <FileInput onChange={handleFormFileInput} />
          <h2>Consentimiento informado</h2>
          <FileInput onChange={handleConsentFileInput} />
        </>
      )}

      <Box align='center' alignContent='center' justify='center' width='100%'>
        <Box
          direction='row'
          pad='large'
          alignContent='center'
          width='100%'
          justify='center'>
          {activeStep > 0 && (
            <Box width='15%'>
              <Button label='volver' color='#f4971a' onClick={handleBack} />
            </Box>
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
            <Box width='15%'>
              <Button label='siguiente' color='#f4971a' onClick={handleNext} />
            </Box>
          )}
          {activeStep === 2 && (
            <Box width='15%'>
              <Link to='/'>
                <Button label='Enviar' onClick={handleEnviar} primary />
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Formulario;
