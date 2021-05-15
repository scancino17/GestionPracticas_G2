import { Button } from 'grommet';
import React, { useState } from 'react';
import './App.css';
import FormBuilder from './dynamicForm/FormBuilder';
import FormView from './dynamicForm/FormView';

const theme = {
  global: {
    colors: {
      brand: 'status-warning',
      focus: 'neutral-3'
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px'
    }
  }
};

function App() {
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
      <FormBuilder formInner={form} setFormInner={setForm} />
      <Button onClick={console.log('form')} />
    </>
  );
}

export default App;
