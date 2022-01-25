import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const useStyles = makeStyles({
  selector: {
    '@media (min-width: 100px)': {
      width: '150px'
    },
    '@media (min-width: 230px)': {
      width: '200px'
    },
    '@media (min-width: 290px)': {
      width: '250px'
    },
    '@media (min-width: 600px)': {
      width: '300px'
    },
    '@media (min-width: 750px)': {
      width: '300px'
    },
    '@media (min-width: 850px)': {
      width: '300px'
    },
    '@media (min-width: 400px)': {
      width: '300px'
    }
  }
});

function CareerSelector({ careerId, setCareerId, excludeGeneral = false }) {
  const [careers, setCareers] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
          temp.push({ id: doc.id, ...doc.data() });
        });
        setCareers(
          excludeGeneral
            ? temp.filter((career) => career.id !== 'general')
            : temp
        );
      });
  }, []);

  return (
    <FormControl>
      <InputLabel id='select-career'>Seleccionar carrera</InputLabel>
      <Select
        labelId='select-career'
        value={careerId}
        onChange={(e) => setCareerId(e.target.value)}
        className={classes.selector}>
        {careers.map((career) => {
          return (
            <MenuItem key={career.id} value={career.id}>
              {career.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default CareerSelector;
