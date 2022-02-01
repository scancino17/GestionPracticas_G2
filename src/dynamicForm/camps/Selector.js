import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { onSnapshot, collection, addDoc } from 'firebase/firestore';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replaceAll(/\W/g, '')
});

const filter = createFilterOptions({
  stringify: (option) => option.value
});

function Selector({
  valueinner,
  camp,
  onParentChange,
  readOnly,
  selectorLabel
}) {
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState();
  const [value, setValue] = useState(valueinner);

  useEffect(() => {
    let unsub = onSnapshot(collection(db, camp), (querySnapshot) => {
      let options = [];
      querySnapshot.forEach((doc) => options.push(doc.data()));
      setOptions(options);
    });
    setLoading(false);
    return unsub;
  }, [camp]);

  function handleCreate(inputValue) {
    setLoading(true);
    const newOption = createOption(inputValue);
    addDoc(collection(db, camp), newOption).then(() => {
      setLoading(false);
      setValue(newOption);
    });
  }

  function handleOnChange(event, newValue) {
    if (newValue) onParentChange(newValue);
    if (typeof newValue === 'string') {
      setValue(createOption(newValue));
    } else if (newValue && newValue.inputValue) {
      handleCreate(newValue.inputValue);
      setValue(createOption(newValue.inputValue));
    } else {
      setValue(newValue);
    }
  }

  function handleFilteroptions(options, params) {
    const filtered = filter(options, params);

    if (params.inputValue !== '' && !(filtered.length > 0)) {
      filtered.push({
        inputValue: params.inputValue,
        label: `Agregar "${params.inputValue}"`
      });
    }

    return filtered;
  }

  function handleOptionLabel(option) {
    if (typeof option === 'string') {
      return option;
    }

    if (option.inputValue) {
      return option.inputValue;
    }

    return option.label;
  }

  return (
    <Autocomplete
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={handleOptionLabel}
      value={value}
      onChange={handleOnChange}
      filterOptions={handleFilteroptions}
      renderOption={(option) => option.label}
      freeSolo
      disabled={isLoading || readOnly}
      renderInput={(params) => (
        <TextField
          {...params}
          label={selectorLabel ? selectorLabel : 'Seleccionar'}
          variant='outlined'
        />
      )}
    />
  );

  /*return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleOnChange}
      onCreateOption={handleCreate}
      options={options}
      // inputValue={value}
      value={value}
    />
  );*/
}

export default Selector;
