import { Box, Button, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { Stepper } from 'react-form-stepper';

import FormView from '../dynamicForm/FormView';
import { db } from '../firebase';
import useAuth from '../providers/Auth';

function Formulario1() {
  const [activeStep, setActiveStep] = useState(0);
  const [form1, setForm1] = useState([]);
  const [form2, setForm2] = useState([]);
  const [form3, setForm3] = useState([]);
  const { user, userData } = useAuth();

  useEffect(() => {
    db.collection('form')
      .doc(userData.careerId)
      .get()
      .then((doc) => {
        const data = doc.data();
        setForm1(data.form1);
        setForm2(data.form2);
        setForm3(data.form3);
      });
  }, []);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  return (
    <>
      <Stepper
        steps={[
          { label: 'Información personal' },
          { label: 'Información de la empresa' },
          { label: 'Archivos' }
        ]}
        activeStep={activeStep}
      />

      {activeStep === 0 && form1 && (
        <FormView form={form1} setForm={setForm1} />
      )}

      {activeStep === 1 && form2 && (
        <FormView form={form2} setForm={setForm2} />
      )}

      {activeStep === 2 && form3 && (
        <FormView form={form3} setForm={setForm3} />
      )}
      <Box width='15%'>
        <Button label='anterior' color='#f4971a' onClick={handleBack} />
      </Box>
      <Box width='15%'>
        <Button label='siguiente' color='#f4971a' onClick={handleNext} />
      </Box>
    </>
  );
}

export default Formulario1;
