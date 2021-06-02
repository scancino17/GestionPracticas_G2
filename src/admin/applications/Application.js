import {
  Box,
  Button,
  Layer,
  Heading,
  Spinner,
  Text,
  TextArea,
  Card,
  Header
} from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { approvedApplication } from '../../InternshipStates';
import Documentos from '../../student/dashboard/extras/Documentos';

function Application() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [docs, setDocs] = useState();
  const [rejectReason, setRejectReason] = useState('');
  const [show, setShow] = useState();
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
    db.collection('applications').doc(id).update({ status: 'Aprobado' });
    db.collection('internships')
      .doc(data.internshipId)
      .update({ status: approvedApplication });

    db.collection('mails').add({
      to: data.email,
      template: {
        name: 'Approved',
        data: {
          from_name: data.name
        }
      }
    });

    history.push(applicationsPath);
  }

  function handleReject() {
    db.collection('applications')
      .doc(id)
      .update({ status: 'Rechazado', reason: rejectReason });

    db.collection('mails').add({
      to: data.email,
      template: {
        name: 'Failed',
        data: {
          from_name: data.name,
          result: rejectReason
        }
      }
    });

    history.push(applicationsPath);
  }

  return (
    <>
      <Header justify='end'>
        <Card direction='row'>
          <Button
            margin='medium'
            align='center'
            icon={<Checkmark />}
            primary
            onClick={handleApprove}
          />
          <Button
            margin='medium'
            icon={<Close />}
            onClick={() => setShow(true)}
          />
        </Card>
      </Header>

      <Box pad='xlarge' overflow='scroll'>
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

            <Box
              margin='medium'
              justify='center'
              align='center'
              direction='row'>
              {show && (
                <Layer
                  onEsc={() => setShow(false)}
                  onClickOutside={() => setShow(false)}>
                  <Box margin='medium'>
                    <Text margin='small'>Razón de rechazo:</Text>
                    <TextArea
                      margin='medium'
                      label='Razón de rechazo'
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <Box align='center' direction='row' justify='center'>
                      <Button
                        label='Confirmar rechazo'
                        Primary
                        onClick={handleReject}></Button>
                      <Button
                        secondary
                        margin='medium'
                        label='Cancelar'
                        onClick={() => setShow(false)}
                      />
                    </Box>
                  </Box>
                </Layer>
              )}
            </Box>
          </>
        ) : (
          <Box>
            <Spinner />
          </Box>
        )}
      </Box>
    </>
  );
}

export default Application;
