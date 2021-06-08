import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

function CareerSelector({ careerId, setCareerId, excludeGeneral = false }) {
  const [careers, setCareers] = useState([]);

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
        style={{ minWidth: '14rem' }}>
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
