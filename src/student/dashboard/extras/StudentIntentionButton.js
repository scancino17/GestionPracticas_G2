import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { pendingIntention } from '../../../InternshipStates';

const approvalState = pendingIntention;

function StudentIntention({ practica, altText }) {
  const [internshipState, setInternshipState] = useState(practica.status);

  const handleOnClick = () => {
    if (internshipState !== approvalState) {
      setInternshipState(approvalState);
    }

    db.collection('internships')
      .doc(practica.id)
      .set({ status: approvalState }, { merge: true });
  };

  const isPendingApproval = () => {
    return internshipState === approvalState;
  };

  useEffect(() => {});

  return (
    <Button onClick={handleOnClick} disabled={isPendingApproval()}>
      {internshipState !== approvalState
        ? altText
          ? altText
          : 'Informar intención de práctica'
        : 'Intención enviada'}
    </Button>
  );
}

export default StudentIntention;
