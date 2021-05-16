import {
  Button,
  FileInput,
  Form,
  FormField,
  Select,
  TextInput,
  Text,
  Box,
  Card
} from 'grommet';
import { useEffect, useState } from 'react';

function FormView(props) {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    setFlag(false);
  }, [props.form, flag]);
  return (
    <>
      <Form>
        <Card gap='medium' pad='medium'>
          {props.form.map((element) =>
            element.type === 'Select' ? (
              <FormField label={element.name}>
                <Select
                  options={element.options}
                  value={element.value}
                  onChange={({ option }) => (element.value = option)}
                />
              </FormField>
            ) : element.type === 'Input' ? (
              <FormField label={element.name} color='red'>
                <TextInput onChange={(e) => (element.value = e.target.value)} />
              </FormField>
            ) : element.type === 'File' ? (
              <FormField label={element.name} color='red'>
                <FileInput
                  onChange={(e) => (element.value = e.target.files[0])}
                />
              </FormField>
            ) : element.type === 'Header' ? (
              <Box fill='vertical'>
                <Text size='4xl'>{element.name}</Text>
              </Box>
            ) : element.type === 'Space' ? (
              <Box fill='vertical'>
                <Text size='4xl'></Text>
              </Box>
            ) : null
          )}
        </Card>
      </Form>
    </>
  );
}
export default FormView;
