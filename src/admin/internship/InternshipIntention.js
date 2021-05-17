import {
  Accordion,
  AccordionPanel,
  Box,
  Button,
  FileInput,
  Heading,
  Layer,
  List,
  Main,
  Text
} from 'grommet';
import React, { useCallback, useEffect, useState } from 'react';
import { db, storage } from '../../firebase';

const approvalState = 'Pendiente Aprobación';
const confirmIntentionState = 'Pendiente';
const deniendState = 'Rechazado';

const IntentionList = ({ applications, update }) => {
  return (
    <Main>
      <Heading>Estudiantes con intención de práctica</Heading>
      <List border={false} data={applications}>
        {(application) => (
          <IntentionItem application={application} update={update} />
        )}
      </List>
    </Main>
  );
};

const IntentionItem = ({ application, update }) => {
  console.log(application);
  const [showApprovalModal, setShowApprovalModal] = useState();
  const [showRejectModal, setShowRejectModal] = useState();

  const closeModal = () => {
    setShowApprovalModal(false);
    setShowRejectModal(false);
  };

  return (
    <Accordion margin='small'>
      <AccordionPanel label={application.name}>
        <Box direction='row-responsive' margin='small'>
          <Text weight='bold'>Nombre: </Text>
          <Text margin={{ left: 'xsmall' }}>{application.name}</Text>
        </Box>
        <Box direction='row-responsive' margin='small'>
          <Text weight='bold'>Rut: </Text>
          <Text margin={{ left: 'xsmall' }}>{application.rut}</Text>
        </Box>
        <Box direction='row-responsive' margin='small'>
          <Text weight='bold'>Matrícula: </Text>
          <Text margin={{ left: 'xsmall' }}>
            {application.enrollmentNumber}
          </Text>
        </Box>
        <Box direction='row-responsive' margin='small'>
          <Text weight='bold'>Práctica: </Text>
          <Text margin={{ left: 'xsmall' }}>
            {application.applicationNumber}
          </Text>
        </Box>
        <Box direction='row-responsive' margin='small' justify='end'>
          <Button
            label='Rechazar'
            color='status-error'
            primary
            margin='small'
            onClick={() => setShowRejectModal(true)}
          />
          <Button
            label='Aprobar'
            color='status-ok'
            primary
            margin='small'
            onClick={() => setShowApprovalModal(true)}
          />
        </Box>
        {showApprovalModal && (
          <ApprovalModal
            application={application}
            closeModal={closeModal}
            update={update}
          />
        )}
        {showRejectModal && (
          <RejectModal
            application={application}
            closeModal={closeModal}
            update={update}
          />
        )}
      </AccordionPanel>
    </Accordion>
  );
};

const RejectModal = ({ application, closeModal, update }) => {
  const handleRejecton = () => {
    db.collection('internships')
      .doc(application.internshipId)
      .update({ status: deniendState });

    closeModal();
    update();
  };

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal}>
      <Box margin='medium'>
        <Box margin='xsmall'>
          <Text>{`¿Está seguro de rechazar Práctica ${application.applicationNumber} de ${application.name}?`}</Text>
          <Text>Esta operación no se podrá revertir.</Text>
        </Box>
        <Box margin='xsmall' direction='row-responsive' justify='end'>
          <Button
            label='Cancelar'
            onClick={closeModal}
            color='status-disabled'
            margin='xsmall'
          />
          <Button
            label='Confirmar rechazo'
            color='status-error'
            margin='xsmall'
            primary
            onClick={handleRejecton}
          />
        </Box>
      </Box>
    </Layer>
  );
};

const ApprovalModal = ({ application, closeModal, update }) => {
  const [letterFile, setLetterFile] = useState();
  const [isConfirmDisabled, setConfirmDisabled] = useState();

  const handleLetterFile = (e) => {
    setLetterFile(e.target.files[0]);
  };

  useEffect(() => {
    console.log(letterFile);
    if (letterFile) {
      setConfirmDisabled(false);
    } else {
      setConfirmDisabled(true);
    }
  }, [letterFile]);

  const handleApproval = () => {
    let { studentId, internshipId } = application;

    db.collection('internships')
      .doc(internshipId)
      .set({ status: confirmIntentionState }, { merge: true });

    storage
      .ref()
      .child(
        `students-docs/${studentId}/${internshipId}/letter/${letterFile.name}`
      )
      .put(letterFile);

    closeModal();
    update();
  };

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal}>
      <Box margin='medium'>
        <Box margin='xsmall'>
          <Text>{`Aprobar intención de Práctica ${application.applicationNumber} de ${application.name}.`}</Text>
          <Text>Adjunte la carta de recomendación correspondiente.</Text>
        </Box>
        <Box margin='xsmall'>
          <FileInput onChange={handleLetterFile} />
        </Box>
        <Box margin='xsmall' direction='row-responsive' justify='end'>
          <Button
            label='Cancelar'
            onClick={closeModal}
            color='status-disabled'
            margin='xsmall'
          />
          <Button
            label='Confirmar aprobación'
            color='status-ok'
            margin='xsmall'
            disabled={isConfirmDisabled}
            primary
            onClick={handleApproval}
          />
        </Box>
      </Box>
    </Layer>
  );
};

function InternshipIntention() {
  const [applications, setApplications] = useState([]);

  const addApplication = useCallback(
    (newItem) => {
      setApplications((prevState) => {
        let newState = [];
        prevState.forEach((item) => newState.push(item));
        newState.push(newItem);
        return newState;
      });
    },
    [setApplications]
  );

  const updateApplications = useCallback(() => {
    setApplications([]);

    db.collection('internships')
      .where('status', '==', approvalState)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const internship = doc.data();
          const internshipId = doc.id;

          db.collection('users')
            .doc(internship.studentId)
            .get()
            .then((student) => {
              addApplication({
                internshipId: internshipId,
                ...internship,
                ...student.data()
              });
            });
        });
      });
  }, [setApplications, addApplication]);

  useEffect(() => {
    updateApplications();
  }, [updateApplications]);

  return (
    <IntentionList applications={applications} update={updateApplications} />
  );
}

export default InternshipIntention;
