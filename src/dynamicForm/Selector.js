import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { db } from '../firebase';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replaceAll(/\W/g, '')
});

function Selector(props) {
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState();
  const [value, setValue] = useState(props.valueinner);

  useEffect(() => {
    const unsubscribe = db
      .collection(props.camp)
      .onSnapshot((querySnapshot) => {
        let options = [];
        querySnapshot.forEach((doc) => options.push(doc.data()));
        setOptions(options);
      });

    setLoading(false);

    return unsubscribe;
  }, []);

  const handleCreate = async (inputValue) => {
    setLoading(true);
    const newOption = createOption(inputValue);

    await db
      .collection(props.camp)
      .add(createOption(inputValue))
      .then(setLoading(false));

    setValue(newOption);
  };

  const handleOnChange = (newValue) => {
    if (newValue) {
      props.onParentChange(newValue);
    }
    setValue(newValue);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleOnChange}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}

export default Selector;
