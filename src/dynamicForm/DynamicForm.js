import { Grid } from '@material-ui/core';
import { useState } from 'react';
import FormBuilder from './FormBuilder';
import FormView from './FormView';

function DynamicForm(props) {
  const [flag, setFlag] = useState(false);
  return (
    <Grid container justify='center' spacing={8}>
      {props.admin && (
        <>
          <Grid item xs={12} md={6}>
            <FormBuilder
              setFlag={setFlag}
              flag={flag}
              indexInner={props.index}
              handlerSetFormInner={props.setForm}
              formInner={props.form}
              formFullInner={props.formFull}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormView
              setFlag={setFlag}
              flag={flag}
              indexInner={props.index}
              handlerSetFormInner={props.setForm}
              formFullInner={props.formFull}
              form={props.form}
            />
          </Grid>
        </>
      )}
      {props.student && (
        <Grid item xs={12} md={12} justify='center'>
          <FormView
            setFlag={setFlag}
            flag={flag}
            indexInner={props.index}
            handlerSetFormInner={props.setForm}
            formFullInner={props.formFull}
            form={props.form}
          />
        </Grid>
      )}
    </Grid>
  );
}
export default DynamicForm;
