import { Button, FileInput, Form, FormField, Select, TextInput } from 'grommet';
import { useState } from 'react';

function FormView() {
  const [form, setForm] = useState([
    {
      name: 'inout test',
      type: 'input',
      value: ''
    },
    {
      name: 'selection test',
      type: 'Select',
      options: ['opcion1', 'opcion2', 'opcion3'],
      value: ''
    },
    {
      name: 'nombre',
      type: 'file',
      value: ''
    }
  ]);
  return (
    <>
      <Form>
        {form.map((element) =>
          element.type === 'Select' ? (
            <FormField
              name='healthcare'
              htmlFor='healthcare'
              label={element.name}>
              <Select
                id='healthcare'
                options={element.options}
                value={form.value}
                onChange={({ option }) => (element.value = option)}
              />
            </FormField>
          ) : element.type === 'input' ? (
            <FormField label={element.name} color='red'>
              <TextInput onChange={(e) => (element.value = e.target.value)} />
            </FormField>
          ) : element.type === 'file' ? (
            <FileInput onChange={(e) => (element.value = e.target.files[0])} />
          ) : null
        )}
        <Button onClick={() => console.log(form)} />
      </Form>
    </>
  );
}
export default FormView;
