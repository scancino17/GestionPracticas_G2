import { Box, Button, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { Stepper } from 'react-form-stepper';
import { useParams } from 'react-router-dom';
import DynamicForm from '../../dynamicForm/DynamicForm';
import { db } from '../../firebase';
import useAuth from '../../providers/Auth';

function EditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [form1, setForm1] = useState([]);
  const [form2, setForm2] = useState([]);
  const [form3, setForm3] = useState([]);
  const { careerId } = useParams();
  const { userData } = useAuth();

  useEffect(() => {
    db.collection('form')
      .doc(careerId)
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
  async function handleSave() {
    const formRef = db.collection('form').doc('3407');

    const res = await formRef.set(
      {
        form1: form1,
        form2: form2,
        form3: form3
      },
      {}
    );
  }
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

      {activeStep === 0 && <DynamicForm form={form1} setForm={setForm1} />}

      {activeStep === 1 && <DynamicForm form={form2} setForm={setForm2} />}

      {activeStep === 2 && <DynamicForm form={form3} setForm={setForm3} />}
      <Box width='15%'>
        <Button label='anterior' color='#f4971a' onClick={handleBack} />
      </Box>
      <Box width='15%'>
        <Button label='siguiente' color='#f4971a' onClick={handleNext} />
      </Box>
      <Box width='15%'>
        <Button label='Guardar' color='#f4971a' onClick={handleSave} />
      </Box>
    </>
  );
}

export default EditForm;
