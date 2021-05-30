import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
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
        console.log(data);
        if (data) {
          setIntership(data.form);
        }
      });
  }, []);
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex'
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(14)
    }
  }));
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <Grid container direction='column' spacing={5}>
        {intership.map((camp) =>
          camp.form.map(
            (form) =>
              form.type !== 'Space' && (
                <Grid item>
                  <Typography variant='h6'>
                    {form.name}={form.value}
                  </Typography>
                </Grid>
              )
          )
        )}
      </Grid>
      <Button onClick={() => console.log(intership)}> intership</Button>
    </div>
  );
}
export default FormCheck;
