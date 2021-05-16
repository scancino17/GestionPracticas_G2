import { Box } from 'grommet';
import { useState } from 'react';
import FormBuilder from './FormBuilder';
import FormView from './FormView';

function DynamicForm() {
  const [form, setForm] = useState([]);
  const [flag, setFlag] = useState(false);
  return (
    <Box direction='row' pad='large'>
      <Box width='35%' height='large'>
        <FormBuilder
          setFlag={setFlag}
          flag={flag}
          handlerSetFormInner={setForm}
          formInner={form}
        />
      </Box>
      <Box flex>
        <FormView
          setFlag={setFlag}
          flag={flag}
          handlerSetFormInner={setForm}
          formInner={form}
        />
      </Box>
    </Box>
  );
}
export default DynamicForm;
