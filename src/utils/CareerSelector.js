import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useSupervisor } from '../providers/Supervisor';
import { DEFAULT_CAREER } from '../providers/User';

function CareerSelector({ careerId, setCareerId, excludeGeneral = false }) {
  const { careers } = useSupervisor();

  return (
    <FormControl fullWidth>
      <InputLabel id='select-career'>Seleccionar carrera</InputLabel>
      <Select
        labelId='select-career'
        value={careerId}
        onChange={(e) => setCareerId(e.target.value)}>
        {careers
          .filter((item) => !excludeGeneral || item.id !== DEFAULT_CAREER)
          .map((career) => {
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
