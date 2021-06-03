import React, { useState } from 'react';
import { Grid, Box } from '@material-ui/core';
import FormBuilder from './FormBuilder';
import FormView from './FormView';

function DynamicForm({ admin, student, index, form, setForm, formFull }) {
  const [flag, setFlag] = useState(false);
  return (
    <Grid container justify='center' spacing={8}>
      {admin && (
        <>
          <Grid item xs={12} md={5} >
            <Box
              display='flex'
              justifyContent='center'
              p={5}
              borderRight={1} 
              borderColor="grey.500"
              height={1} 
              width={1}>
              <FormBuilder
                flag={flag}
                setFlag={setFlag}
                indexInner={index}
                handlerSetFormInner={setForm}
                formInner={form}
                formFullInner={formFull}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <FormView
              setFlag={setFlag}
              flag={flag}
              indexInner={index}
              handlerSetFormInner={setForm}
              formFullInner={formFull}
              form={form}
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
