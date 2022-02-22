import React, { useState } from 'react';
import { Grid, Divider, Box } from '@material-ui/core';
import FormBuilder from './FormBuilder';
import FormView from './FormView';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isMobile } from 'react-device-detect';

function DynamicForm({
  admin,
  student,
  index,
  form,
  setForm,
  formFull,
  filesInner,
  setFilesInner,
  flag,
  setFlag
}) {
  const matches = useMediaQuery('(max-width:650px)');

  return (
    <>
      {admin && (
        <Grid
          container
          direction='row'
          justifyContent='center'
          spacing={isMobile && matches ? 0 : 6}>
          <Grid item xs={12} sm md xl>
            <FormBuilder
              flag={flag}
              setFlag={setFlag}
              indexInner={index}
              handlerSetFormInner={setForm}
              formInner={form}
              formFullInner={formFull}
            />
          </Grid>
          <Divider orientation='vertical' flexItem />
          <Grid item xs={12} sm md xl>
            <Box sx={{ minWidth: isMobile && matches ? 300 : 410 }}>
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
            </Box>
          </Grid>
        </Grid>
      )}
      {student && (
        <Grid container direction='row' justifyContent='center' spacing={8}>
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
        </Grid>
      )}
    </>
  );
}

export default DynamicForm;
