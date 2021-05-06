import { Box, Button, Heading, Spinner, Text, TextArea } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import Documentos from '../../student/dashboard/extras/Documentos';

function Application() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [docs, setDocs] = useState();
  const [rejected, setRejected] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  var history = useHistory();
  var applicationsPath = '/applications';

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
    history.push(applicationsPath);
  }

  function handleReject() {
    db.collection('internships')
      .doc(data.internshipId)
      .update({ status: 'Rechazado', reason: rejectReason });
    history.push(applicationsPath);
  }

  return (
    <Box pad='xlarge'>
      {data && docs ? (
        <>
          <Heading>Formulario de inscripción de práctica</Heading>
          <Heading level='3'>Información personal</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.name}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>RUT: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.rut}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Número de matrícula: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.enrollmentNumber}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.phone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.email}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre contacto de emergencia: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.emergencyContact}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono de emergencia: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.emergencyPhone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Seguro de salud: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.healthCare}</Text>
          </Box>
          <Heading level='3'>Información de la empresa</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre de la empresa: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.companyName}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Ciudad donde se realizará la práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.city}</Text>
          </Box>
          <Heading level='3'>Información del supervisor</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Nombre completo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.supervisorName}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Cargo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.supervisorPosition}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Teléfono del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.sueprvisorPhone}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Correo del supervisor: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.supervisorEmail}</Text>
          </Box>
          <Heading level='3'>Acerca de la práctica</Heading>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Práctica </Text>
            <Text margin={{ left: 'xsmall' }}>{data.applicationNumber}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Modalidad: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.modality}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de inicio de práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.startDate}</Text>
          </Box>
          <Box direction='row-responsive' margin='small'>
            <Text weight='bold'>Fecha de término de práctica: </Text>
            <Text margin={{ left: 'xsmall' }}>{data.endDate}</Text>
          </Box>
          <Heading level='3'>Archivos adjuntos</Heading>
          <Documentos docs={docs} />
          <Box justify='center' pad='small' orientation='row-responsive'>
            <Button
              label='Aprobar'
              margin='xsmall'
              primary
              onClick={handleApprove}
            />
            <Button
              label='Rechazar'
              margin='xsmall'
              secondary
              onClick={() => setRejected(true)}
            />
          </Box>
          {rejected && (
            <Box>
              <Heading level='4' weight='bold'>
                Razón de Rechazo
              </Heading>
              <TextArea
                label='Razón de rechazo'
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Button
                label='Confirmar'
                margin='small'
                onClick={handleReject}
                primary
              />
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Spinner />
        </Box>
      )}
    </Box>
  );
}

export default Application;
