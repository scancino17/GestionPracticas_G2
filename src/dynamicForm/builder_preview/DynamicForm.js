import React, { useEffect, useState } from 'react';
import { Grid, Divider } from '@material-ui/core';
import FormBuilder from './FormBuilder';
import FormView from './FormView';

function DynamicForm({
  admin,
  student,
  index,
  form,
  setForm,
  formFull,
  filesInner,
  setFilesInner,updateInner,setUpdate
}) {
  const [flag, setFlag] = useState(false);


  return (
    <Grid container direction='row'justifyContent='center' spacing={8}>
      {admin && (
        <>
          <Grid item xs={12} md={5} >
            <FormBuilder
              flag={flag}
              setFlag={setFlag}
              indexInner={index}
              handlerSetFormInner={setForm}
              formInner={form}
              formFullInner={formFull}
            />
          </Grid>
          <Divider orientation='vertical' flexItem/>
          <Grid item xs={12} md={6}>
            <FormView
              filesInnerInner={filesInner}
              setFilesInnerInner={setFilesInner}
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
        <Grid item xs={12} md={12} justifyContent='center'>
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
