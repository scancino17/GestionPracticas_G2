import { Box, Button, Heading, Main, Spinner, Text, TextArea } from 'grommet';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import Documentos from '../../student/dashboard/extras/Documentos';

function Application() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [docs, setDocs] = useState();
  const [rejected, setRejected] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    db.collection('applications')
      .doc(id)
      .get()
      .then((doc) => {
        setData(doc.data());
      });
  }, [id]);

  useEffect(() => {
    if (data)
      storage
        .ref(`students-docs/${data.studentId}/${data.internshipId}`)
        .listAll()
        .then((res) => setDocs(res.items));
  }, [data]);

  function handleApprove() {
    db.collection('internships')
      .doc(data.internshipId)
      .update({ status: 'Aprobado' });
  }

  function handleReject() {
    db.collection('internships')
      .doc(data.internshipId)
      .update({ status: 'Rechazado', reason: rejectReason });
  }

  return (
    <Main pad='xlarge'>
      {data && docs ? (
        <>
          <Heading>Formulario de inscripción de práctica</Heading>
          <Heading level='3'>Información personal</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre: </Text>
            <Text>{data.name}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>RUT: </Text>
            <Text>{data.rut}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Número de matrícula: </Text>
            <Text>{data.enrollmentNumber}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono: </Text>
            <Text>{data.phone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo: </Text>
            <Text>{data.email}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre contacto de emergencia: </Text>
            <Text>{data.emergencyContact}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono de emergencia: </Text>
            <Text>{data.emergencyPhone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Seguro de salud: </Text>
            <Text>{data.healthCare}</Text>
          </Box>
          <Heading level='3'>Información de la empresa</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre de la empresa: </Text>
            <Text>{data.companyName}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Ciudad donde se realizará la práctica: </Text>
            <Text>{data.city}</Text>
          </Box>
          <Heading level='3'>Información del supervisor</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre completo del supervisor: </Text>
            <Text>{data.supervisorName}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Cargo del supervisor: </Text>
            <Text>{data.supervisorPosition}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono del supervisor: </Text>
            <Text>{data.sueprvisorPhone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo del supervisor: </Text>
            <Text>{data.supervisorEmail}</Text>
          </Box>
          <Heading level='3'>Acerca de la práctica</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Práctica </Text>
            <Text>{data.applicationNumber}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Modalidad: </Text>
            <Text>{data.modality}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de inicio de práctica: </Text>
            <Text>{data.startDate}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de término de práctica: </Text>
            <Text>{data.endDate}</Text>
          </Box>
          <Heading level='3'>Archivos adjuntos</Heading>
          <Documentos docs={docs} />
          <Box justify='center' pad='small' orientation='row-responsive'>
            <Link to='/applications'>
              <Button label='Aprobar' primary onClick={handleApprove} />
            </Link>
            <Button
              label='Rechazar'
              secondary
              onClick={() => setRejected(true)}
            />
          </Box>
          {rejected && (
            <Box>
              <TextArea
                label='Razón de rechazo'
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Link to='/applications'>
                <Button label='Confirmar' onClick={handleReject} primary />
              </Link>
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Spinner />
        </Box>
      )}
    </Main>
  );
}

export default Application;
