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
  Text,
  TextInput
} from 'grommet';
import { Car } from 'grommet-icons';
import react from 'react';
import React, { createElement, useState } from 'react';

function FormBuilder(props) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState('');
  const [form, setForm] = useState();

  function ConstructorForm(props) {
    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [options, setOpctions] = useState([]);
    const [newOption, setNewOption] = useState('');

    return (
      <Layer
        modal={true}
        onEsc={() => setShow(false)}
        onClickOutside={() => setShow(false)}>
        <Card pad='large'>
          <Select
            options={['Input', 'Select', 'File', 'Header']}
            value={value}
            onChange={({ option }) => setValue(option)}
          />
          {value === 'Input' ? (
            <>
              <h1>Input</h1>
              <FormField label={'Nombre'} color='red'>
                <TextInput />
              </FormField>
            </>
          ) : value === 'Select' ? (
            <>
              <h1>Select</h1>
              <FormField label={'Nombre'} color='red'>
                <TextInput />
              </FormField>
              <Box direction='row' justify='center' align='center'>
                <Box
                  width='auto'
                  flex
                  border={{ color: 'brand', size: 'small' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell scope='col' border='bottom'>
                          opcion
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
          ) : value === 'File' ? (
            <>
              <h1>File</h1>
              <FormField label={'Nombre'} color='red'>
                <TextInput />
              </FormField>
            </>
          ) : value === 'Header' ? (
            <>
              <h1>Header</h1>
              <FormField label={'Titulo'} color='red'>
                <TextInput />
              </FormField>
            </>
          ) : null}
          <Button label='guardar' />
        </Card>
      </Layer>
    );
  }

  return (
    <>
      <Box direction='row' justify='center' align='center'>
        <Box width='auto' flex border={{ color: 'brand', size: 'small' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope='col' border='bottom'>
                  Nombre
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Tipo
                </TableCell>

                <TableCell scope='col' border='bottom'></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.formInner.map((rec) => (
                <TableRow key={rec.i}>
                  <TableCell scope='col'>
                    <Text>{rec.name}</Text>
                  </TableCell>
                  <TableCell scope='col'>
                    <Text>
                      <Text>{rec.type}</Text>
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Button
                      label='eliminar'
                      onClick={() => console.log('eliminar')}
                    />
                    <Button
                      label='arriba'
                      onClick={() => console.log('arriba')}
                    />
                    <Button
                      label='abajo'
                      onClick={() => console.log('eliminar')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box>
          <Button label='show' onClick={() => setShow(true)} />
          {show && <ConstructorForm />}
        </Box>
      </Box>
    </>
  );
}
export default FormBuilder;
