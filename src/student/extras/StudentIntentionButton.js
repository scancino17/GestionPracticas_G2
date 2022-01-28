import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { pendingIntention } from '../../InternshipStates';
import { useStudent } from '../../providers/Student';

const approvalState = pendingIntention;

function StudentIntention({ practica, altText, forceDisable }) {
  const [internshipState, setInternshipState] = useState(practica.status);
  const { updateInternship } = useStudent();

  const handleOnClick = () => {
    if (internshipState !== approvalState) {
      setInternshipState(approvalState);
    }

    updateInternship(practica.id, { status: approvalState });
  };

  const isPendingApproval = () => {
    return internshipState === approvalState;
  };
  return (
    <Button
      onClick={handleOnClick}
      disabled={forceDisable || isPendingApproval()}
      color='primary'>
      {internshipState !== approvalState
        ? altText
          ? altText
          : 'Informar intención de práctica'
        : 'Intención enviada'}
    </Button>
  );
}

export const availableInternshipa = 'Práctica disponible 📑';
export const pendingIntentiona = 'Intención enviada 📨';
export const approvedIntentiona = 'Intención aprobada ✔️';
export const deniedIntentiona = 'Intención rechazada ❌';
export default StudentIntention;
