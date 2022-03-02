import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { pendingIntention } from '../../InternshipStates';
import { useStudent } from '../../providers/Student';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
const approvalState = pendingIntention;

function StudentIntention({ practica, altText, forceDisable, reprove }) {
  const [internshipState, setInternshipState] = useState(practica.status);
  const { updateInternship, newInternship } = useStudent();

  const handleOnClick = () => {
    if (!reprove) {
      if (internshipState !== approvalState) {
        setInternshipState(approvalState);
      }
      updateInternship(practica.id, {
        status: approvalState,
        sentTime: serverTimestamp()
      });
    } else {
      newInternship(practica.internshipNumber, practica.id);
    }
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
