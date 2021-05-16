import {
  Box,
  Button,
  Card,
  FormField,
  Layer,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TextInput,
  Text
} from 'grommet';
import { useState } from 'react';

function ConstructorCamp(props) {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [options, setOpctions] = useState([]);
  const [newOption, setNewOption] = useState('');
  function handlerAddCamp() {
    let temp;
    if (type === 'Input') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Select') {
      temp = {
        type: type,
        name: name,
        options: options,
        value: ''
      };
    } else if (type === 'File') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Header') {
      temp = {
        type: type,
        name: name,
        value: ''
      };
    } else if (type === 'Space') {
      temp = {
        type: type
      };
    }
    console.log(temp);
    props.handlerSetFormInnerInner((prev) => prev.concat(temp));
  }
  return (
    <Layer
      modal={true}
      onEsc={() => props.setShow(false)}
      onClickOutside={() => props.setShow(false)}>
      <Card pad='large'>
        <Select
          options={['Input', 'Select', 'File', 'Header', 'Space']}
          value={type}
          onChange={({ option }) => setType(option)}
        />
        {type === 'Input' ? (
          <>
            <h1>Input</h1>
            <FormField label={'Nombre'} color='red'>
              <TextInput onChange={(e) => setName(e.target.value)} />
            </FormField>
          </>
        ) : type === 'Select' ? (
          <>
            <h1>Select</h1>
            <FormField label={'Nombre'} color='red'>
              <TextInput onChange={(e) => setName(e.target.value)} />
            </FormField>
            <Box direction='row' justify='center' align='center'>
              <Box width='auto' flex border={{ color: 'brand', size: 'small' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell scope='col' border='bottom'>
                        opción
                      </TableCell>
                      <TableCell scope='col' border='bottom'></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {options.map((option) => (
                      <TableRow key={option.i}>
                        <TableCell scope='col'>
                          <Text>{option}</Text>
                        </TableCell>
                        <TableCell scope='col'>
                          <Button
                            label='-'
                            onClick={() =>
                              setOpctions((prev) =>
                                prev.filter((element) => element !== option)
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell scope='col'>
                        <TextInput
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                        />
                      </TableCell>
                      <TableCell scope='col'>
                        <Button
                          label='+'
                          onClick={() => {
                            setOpctions((prev) => prev.concat(newOption));
                            setNewOption('');
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </>
        ) : type === 'File' ? (
          <>
            <h1>File</h1>
            <FormField label={'Nombre'} color='red'>
              <TextInput onChange={(e) => setName(e.target.value)} />
            </FormField>
          </>
        ) : type === 'Header' ? (
          <>
            <h1>Header</h1>
            <FormField label={'Titulo'} color='red'>
              <TextInput onChange={(e) => setName(e.target.value)} />
            </FormField>
          </>
        ) : type === 'Space' ? (
          <></>
        ) : null}
        <Button
          label='guardar'
          onClick={() => {
            handlerAddCamp();
            props.setShow(false);
          }}
        />
      </Card>
    </Layer>
  );
}
export default ConstructorCamp;
