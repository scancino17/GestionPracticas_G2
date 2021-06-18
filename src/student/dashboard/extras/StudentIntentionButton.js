import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { db } from '../../../firebase';
import { pendingIntention } from '../../../InternshipStates';

const approvalState = pendingIntention;

function StudentIntention({ practica, altText, forceDisable }) {
  const [internshipState, setInternshipState] = useState(practica.status);

  const handleOnClick = () => {
    if (internshipState !== approvalState) {
      setInternshipState(approvalState);
    }

    db.collection('internships')
      .doc(practica.id)
      .update({ status: approvalState });
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

export default StudentIntention;
