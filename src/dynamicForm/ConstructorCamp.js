import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  Modal
} from '@material-ui/core';
import { Add, Delete, Save } from '@material-ui/icons';
import { FormField, TextInput, Text } from 'grommet';
import { useState } from 'react';

function ConstructorCamp(props) {
  const [type, setType] = useState('');
  const [types, setTypes] = useState([
    'Input',
    'Select',
    'File',
    'Header',
    'Space'
  ]);
  const [name, setName] = useState('');
  const [openSelect, setopenSelect] = useState('');
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
        value: '',
        open: false
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
    //console.log(props.formInnerInner);
    const aux = props.formFullInnerInner();
    console.log(aux);
    aux[props.indexInnerInner].form.push(temp);
    console.log(aux);
    props.handlerSetFormInnerInner(aux);
    props.setFlagInner(true);
  }
  return (
    <Modal
      open={props.show}
      onClose={() => props.setShow(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box justifyContent='center' width={1 / 2}>
        <Box bgcolor='white' padding={8}>
          <Grid container direction='column' spacing={5}>
            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel>Tipo de Campo</InputLabel>
                <Select
                  fullWidth
                  value={type}
                  open={openSelect}
                  onClose={() => setopenSelect(false)}
                  onOpen={() => setopenSelect(true)}
                  onChange={(e) => setType(e.target.value)}>
                  <MenuItem value={''}>None</MenuItem>
                  {types.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {type === 'Input' ? (
              <>
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant='outlined'
                    xs={12}
                    required
                    id='standard-required'
                    label={'Nombre'}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
              </>
            ) : type === 'Select' ? (
              <>
                <Grid item xs>
                  <h1>Select</h1>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      variant='outlined'
                      xs={12}
                      required
                      id='standard-required'
                      label={'Nombre'}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs>
                    <Grid item width='auto' flex>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='col' border='bottom'>
                              opción
                            </TableCell>
                            <TableCell scope='col' border='bottom'></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {options.map((option) => (
                            <TableRow key={option.i}>
                              <TableCell scope='col'>
                                <Text>{option}</Text>
                              </TableCell>
                              <TableCell scope='col'>
                                <IconButton
                                  onClick={() =>
                                    setOpctions((prev) =>
                                      prev.filter(
                                        (element) => element !== option
                                      )
                                    )
                                  }>
                                  <Delete />
                                </IconButton>
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
                              <IconButton
                                onClick={() => {
                                  setOpctions((prev) => prev.concat(newOption));
                                  setNewOption('');
                                }}>
                                <Add />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : type === 'File' ? (
              <>
                <Grid item xs>
                  <h1>File</h1>
                  <TextField
                    fullWidth
                    variant='outlined'
                    xs={12}
                    required
                    id='standard-required'
                    label={'Nombre'}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
              </>
            ) : type === 'Header' ? (
              <>
                <Grid item xs>
                  <h1>Header</h1>
                  <TextField
                    fullWidth
                    variant='outlined'
                    xs={12}
                    required
                    id='standard-required'
                    label={'Titulo'}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
              </>
            ) : type === 'Space' ? (
              <></>
            ) : null}
            {type !== '' ? (
              <Button
                startIcon={<Save />}
                onClick={() => {
                  handlerAddCamp();
                  props.setShow(false);
                }}
              />
            ) : null}
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
export default ConstructorCamp;
{
  /**
   */
}
