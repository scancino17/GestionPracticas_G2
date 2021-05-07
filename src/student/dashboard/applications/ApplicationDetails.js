import { Box, Heading, Spinner, Text, TextArea } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Documentos from '../extras/Documentos';
import { db, storage } from '../../../firebase';

function ApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState();
  const [docs, setDocs] = useState();

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

  return (
    <Box pad='xlarge'>
      {application && docs ? (
        <>
          <Heading>Formulario de inscripción de práctica</Heading>
          <Heading level='3'>Información personal</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.name}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>RUT: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.rut}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Número de matrícula: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.enrollmentNumber}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.phone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.email}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre contacto de emergencia: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.emergencyContact}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono de emergencia: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.emergencyPhone}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Seguro de salud: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.healthCare}</Text>
          </Box>
          <Heading level='3'>Información de la empresa</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre de la empresa: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.companyName}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Ciudad donde se realizará la práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.city}</Text>
          </Box>
          <Heading level='3'>Información del supervisor</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre completo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.supervisorName}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Cargo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.supervisorPosition}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.sueprvisorPhone}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.supervisorEmail}
            </Text>
          </Box>
          <Heading level='3'>Acerca de la práctica</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Práctica </Text>
            <Text margin={{ left: 'xsmall' }}>
              {application.applicationNumber}
            </Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Modalidad: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.modality}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de inicio de práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.startDate}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de término de práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.endDate}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Estado de solicitud: </Text>
            <Text margin={{ left: 'xsmall' }}>{application.status}</Text>
          </Box>
          {application.status === 'Rechazado' && (
            <Box>
              <Heading level='3' weight='bold'>
                Razón de Rechazo
              </Heading>
              <TextArea
                label='Razón de rechazo'
                value={application.reason}
                focusIndicator={false}
              />
            </Box>
          )}
          <Heading level='3'>Archivos adjuntos</Heading>
          <Documentos docs={docs} />
        </>
      ) : (
        <Box>
          <Spinner />
        </Box>
      )}
    </Box>
  );
}

export default ApplicationDetails;
