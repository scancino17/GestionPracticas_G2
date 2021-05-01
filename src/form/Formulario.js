import React, { useState } from 'react';
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
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import useAuth from '../providers/Auth';

function Formulario() {
  // Application number para poder usarlo
  let { applicationNumber } = useParams();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    nameStudent: '',
    emailStudent: '',
    matricula: '',
    phoneStudent: '',
    emergencyPhoneStudent: '',
    rutStudent: '',
    modality: '',
    healtCare: '',
    nameCompany: '',
    city: '',
    startDate: '',
    endDate: '',
    nameSupervisor: '',
    emailSupervisor: '',
    positionSupervisor: '',
    phoneSupervisor: '',
    rutSupervisor: ''
  });
  const [file, setFile] = useState();

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  function handleFileInput(e) {
    setFile(e.target.files[0]);
  }

  const handleEnviar = () => {
    db.collection('applications').add(form);
    storage.ref().child(`students-docs/${user.uid}/${file.name}`).put(file);
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
              <FormField
                name='name'
                htmlFor='text-input-id'
                label='Nombre completo'>
                <TextInput
                  id='text-input-id'
                  name='name'
                  value={form.nameStudent}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      nameStudent: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField name='email' htmlFor='text-input-id' label='Correo'>
                <TextInput
                  id='text-input-email'
                  name='email'
                  type='email'
                  value={form.emailStudent}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      emailStudent: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField
                name='enrollment'
                htmlFor='text-input-id'
                label='Numero de matricula'>
                <TextInput
                  id='text-input-id'
                  name='enrollment'
                  value={form.matricula}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      matricula: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField name='phone' htmlFor='text-input-id' label='Telefono'>
                <TextInput
                  id='text-input-id'
                  name='phone'
                  value={form.phoneStudent}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      phoneStudent: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField
                name='emergencyPhone'
                htmlFor='text-input-id'
                label='Telefono de emergencia'>
                <TextInput
                  id='text-input-id'
                  name='emergencyPhone'
                  value={form.emergencyPhoneStudent}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      emergencyPhoneStudent: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField name='rut' htmlFor='text-input-id' label='RUT'>
                <TextInput
                  id='text-input-id'
                  name='rut'
                  value={form.rutStudent}
                  onChange={(e) =>
                    setForm((prevState) => ({
                      ...prevState,
                      rutStudent: e.target.value
                    }))
                  }
                />
              </FormField>
              <FormField
                name='modality'
                htmlFor='text-input-id'
                label='Modalidad'>
                <Select
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
                name='healthCare'
                htmlFor='text-input-id'
                label='Seguro de salud'>
                <Select
                  options={['Fonasa', 'Isapre', 'No se sabe']}
                  value={form.healtCare}
                  onChange={({ option }) =>
                    setForm((prevState) => ({
                      ...prevState,
                      healtCare: option
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
                <FormField name='name' htmlFor='text-input-id' label='Nombre'>
                  <TextInput
                    id='text-input-id'
                    name='name'
                    value={form.nameCompany}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        nameCompany: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='city'
                  htmlFor='text-input-id'
                  label='Ciudad donde se realizara la practica'>
                  <TextInput
                    id='text-input-id'
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
                <FormField
                  name='startDate'
                  htmlFor='date-input-id'
                  label='Inicio de practica'>
                  <DateInput
                    id='date-input-id'
                    name='startDate'
                    format='mm/dd/yyyy'
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
                  name='endDate'
                  htmlFor='date-input-id'
                  label='Fin de practica'>
                  <DateInput
                    id='date-input-id'
                    name='endDate'
                    format='mm/dd/yyyy'
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
              <h1>Informacion del supervisor</h1>
              <Form>
                <FormField
                  name='name'
                  htmlFor='text-input-id'
                  label='Nombre completo'>
                  <TextInput
                    id='text-input-id'
                    name='name'
                    value={form.nameSupervisor}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        nameSupervisor: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField name='email' htmlFor='text-input-id' label='Correo'>
                  <TextInput
                    id='text-input-email'
                    name='email'
                    type='email'
                    value={form.emailSupervisor}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        emailSupervisor: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='position'
                  htmlFor='text-input-id'
                  label='Cargo'>
                  <TextInput
                    id='text-input-id'
                    name='position'
                    value={form.positionSupervisor}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        positionSupervisor: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField
                  name='phone'
                  htmlFor='text-input-id'
                  label='Telefono'>
                  <TextInput
                    id='text-input-id'
                    name='phone'
                    value={form.phoneSupervisor}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        phoneSupervisor: e.target.value
                      }))
                    }
                  />
                </FormField>
                <FormField name='rut' htmlFor='text-input-id' label='RUT'>
                  <TextInput
                    id='text-input-id'
                    name='rut'
                    value={form.rutSupervisor}
                    onChange={(e) =>
                      setForm((prevState) => ({
                        ...prevState,
                        rutSupervisor: e.target.value
                      }))
                    }
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
          <FileInput onChange={handleFileInput} />
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
              form.nameStudent === '' ||
              form.emailStudent === '' ||
              form.matricula === '' ||
              form.phoneStudent === '' ||
              form.emergencyPhoneStudent === '' ||
              form.rutStudent === '' ||
              form.modality === '' ||
              form.healtCare === ''
            )) ||
            (activeStep === 1 &&
              !(form.nameCompany === '',
              form.city === '' ||
                form.startDate === '' ||
                form.endDate === '' ||
                form.nameSupervisor === '' ||
                form.emailSupervisor === '' ||
                form.positionSupervisor === '' ||
                form.phoneSupervisor === '' ||
                form.rutSupervisor === ''))) && (
            <Box width='15%'>
              <Button label='siguiente' color='#f4971a' onClick={handleNext} />
            </Box>
          )}
          {activeStep === 2 && (
            <Box width='15%'>
              <Button label='Enviar' color='#f4971a' onClick={handleEnviar} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Formulario;
