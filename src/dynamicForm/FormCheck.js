import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';

function FormCheck() {
  const { careerId } = useParams();
  const [intership, setIntership] = useState([]);
  useEffect(() => {
    db.collection('form')
      .doc(careerId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) setIntership(data.form);
      });
  }, []);

  return (
    <>
      <Grid container direction='column' spacing={5}>
        {intership.map((camp) =>
          camp.form.map((form) => {
            form.type !== 'Space' && (
              <Grid item>
                <Typography variant='h6'>
                  {form.name}={form.value}
                </Typography>
              </Grid>
            );
          })
        )}
      </Grid>
      <Button onClick={() => console.log(intership)}> intership</Button>
    </>
  );
}
export default FormCheck;
