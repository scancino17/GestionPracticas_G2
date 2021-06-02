import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { approvedIntention } from '../../../InternshipStates';

const approvalState = approvedIntention;

function StudentIntention({ practica }) {
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
        ? 'Informar intención de práctica'
        : 'Intención enviada'}
    </Button>
  );
}

export default StudentIntention;
