import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import FormBuilder from './FormBuilder';
import FormView from './FormView';

function DynamicForm({ admin, student, index, form, setForm, formFull }) {
  const [flag, setFlag] = useState(false);
  return (
    
    <Grid container justify='center' spacing={8}>
      {admin && (
        <>
          
          <Grid item xs={12} md={6}>
            <FormView
              setFlag={setFlag}
              flag={flag}
              indexInner={index}
              handlerSetFormInner={setForm}
              formFullInner={formFull}
              form={form}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{background:'#ffffff'}}>
            <FormBuilder
              flag={flag}
              setFlag={setFlag}
              indexInner={index}
              handlerSetFormInner={setForm}
              formInner={form}
              formFullInner={formFull}
            />
          </Grid>
        </>
      )}
      {student && (
        <Grid item xs={12} md={12} justify='center'>
          <FormView
            setFlag={setFlag}
            flag={flag}
            indexInner={index}
            handlerSetFormInner={setForm}
            formFullInner={formFull}
            form={form}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default DynamicForm;
