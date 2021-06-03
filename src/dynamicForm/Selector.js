import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { db } from '../firebase';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replaceAll(/\W/g, '')
});

function Selector({ valueinner, camp, onParentChange, edit }) {
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState();
  const [value, setValue] = useState(valueinner);

  useEffect(() => {
    const unsubscribe = db.collection(camp).onSnapshot((querySnapshot) => {
      let options = [];
      querySnapshot.forEach((doc) => options.push(doc.data()));
      setOptions(options);
    });
    setLoading(false);
    return unsubscribe;
  }, []);

  function handleCreate(inputValue) {
    setLoading(true);
    const newOption = createOption(inputValue);
    db.collection(camp)
      .add(createOption(inputValue))
      .then(() => {
        setLoading(false);
        setValue(newOption);
      });
  }

  function handleOnChange(newValue) {
    if (newValue) onParentChange(newValue);
    setValue(newValue);
  }

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleOnChange}
      onCreateOption={handleCreate}
      options={options}
      inputValue={value}
      value={value}
    />
  );
}

export default Selector;
