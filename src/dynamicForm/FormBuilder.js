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
import { Add, Down, Trash, Up } from 'grommet-icons';

import React, { createElement, useState, useEffect } from 'react';
import ConstructorCamp from './ConstructorCamp';

function FormBuilder(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    props.setFlag(false);
  }, [props.formInner, props.flag]);

  function hadlerDelete(element) {
    props.handlerSetFormInner((prev) => prev.filter((el) => el !== element));
  }
  function handlerUp(index) {
    props.handlerSetFormInner((prev) => array_move(prev, index, index - 1));
    props.setFlag(true);
  }

  function handlerDown(index) {
    props.handlerSetFormInner((prev) => array_move(prev, index, index + 1));
    props.setFlag(true);
  }
  function array_move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
  }
  return (
    <>
      <Box direction='row'>
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
              {props.formInner.map((rec, i) => (
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
                      icon={<Trash />}
                      onClick={() => hadlerDelete(rec)}
                    />
                    {i !== 0 && (
                      <Button icon={<Up />} onClick={() => handlerUp(i)} />
                    )}
                    {i !== props.formInner.length - 1 && (
                      <Button icon={<Down />} onClick={() => handlerDown(i)} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box>
          <Button
            alignSelf='start'
            icon={<Add />}
            onClick={() => setShow(true)}
          />
          {show && (
            <ConstructorCamp
              handlerSetFormInnerInner={props.handlerSetFormInner}
              setShow={setShow}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
export default FormBuilder;
