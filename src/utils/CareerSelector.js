import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

function CareerSelector({ careerId, setCareerId, excludeGeneral }) {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
          if (excludeGeneral && doc.id !== 'general')
            temp.push({ id: doc.id, ...doc.data() });
        });
        setCareers(temp);
      });
  }, []);

  return (
    <Grid container justify='flex-end' alignItems='center' spacing={4}>
      <Grid item>
        <Typography variant='h5'>Carrera:</Typography>
      </Grid>
      <Grid item>
        <FormControl>
          <InputLabel id='select-career'>Seleccionar carrera</InputLabel>
          <Select
            labelId='select-career'
            value={careerId}
            onChange={(e) => setCareerId(e.target.value)}
            style={{ minWidth: '12rem' }}>
            {careers.map((career) => {
              return (
                <MenuItem key={career.id} value={career.id}>
                  {career.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
