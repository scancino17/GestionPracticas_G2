import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db } from '../firebase';
import useAuth from '../providers/Auth';
import {
  Grid,
  Modal,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import { Add, ArrowDownward, ArrowUpward, Delete } from '@material-ui/icons';
import { TextInput } from 'grommet';

function EditForm() {
  const [formFull, setFormFull] = useState([]);
  const [form1, setForm1] = useState([]);
  const [form2, setForm2] = useState([]);
  const [form3, setForm3] = useState([]);
  const [show, setShow] = useState('');
  const [newOption, setNewOption] = useState('');
  const [flag, setFlag] = useState(false);
  const { careerId } = useParams();
  const { userData } = useAuth();
  function getStepContent(stepIndex) {}
  useEffect(() => {
    db.collection('form')
      .doc(careerId)
      .get()
      .then((doc) => {
        const data = doc.data();
        console.log(data);
        if (data) {
          setFormFull(data.form);
        }
      });
  }, []);
  useEffect(() => {
    console.log(formFull);
    setFlag(false);
  }, [flag]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  function getFormFull() {
    return formFull;
  }
  async function handleSave() {
    console.log(formFull);
    db.collection('form').doc(careerId).set({ form: formFull });
  }
  function hadlerDelete(element) {
    setFormFull((prev) => prev.filter((el) => el !== element));
  }
  function handlerUp(index) {
    setFormFull((prev) => array_move(prev, index, index - 1));
    setFlag(true);
  }

  function handlerDown(index) {
    setFormFull((prev) => array_move(prev, index, index + 1));
    setFlag(true);
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
      <Button variant='contained' color='primary' onClick={() => setShow(true)}>
        Administrar Pasos
      </Button>
      <Stepper activeStep={activeStep} alternativeLabel>
        {formFull.map((step) => (
          <Step key={step.step}>
            <StepLabel>{step.step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === formFull.length ? (
          <div>
            <Typography>Guardar</Typography>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Guardar
            </Button>
          </div>
        ) : (
          <div>
            {formFull.map(
              (form, i) =>
                i === activeStep && (
                  <DynamicForm
                    setForm={setFormFull}
                    form={form.form}
                    formFull={getFormFull}
                    index={i}
                    admin
                  />
                )
            )}
            <div>
              <Button
                variant='contained'
                color='primary'
                disabled={activeStep === 0}
                onClick={handleBack}>
                Back
              </Button>
              <Button variant='contained' color='primary' onClick={handleNext}>
                {activeStep === formFull.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
        <Modal
          open={show}
          onClose={() => setShow(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Box bgcolor='white' padding={8}>
            <Grid container direction='column' spacing={5}>
              <Grid item xs>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col' border='bottom'>
                        <Typography>Nombre</Typography>
                      </TableCell>
                      <TableCell scope='col' border='bottom'>
                        <Typography>Acciones</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formFull.map((form, i) => (
                      <TableRow key={form.i}>
                        <TableCell scope='col'>
                          <Grid>
                            <Typography>{form.step}</Typography>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Grid container direction='colum' spacing={4}>
                            <Grid xs={3}>
                              <IconButton onClick={() => hadlerDelete(form)}>
                                <Delete />
                              </IconButton>
                            </Grid>
                            <Grid xs={3}>
                              {i !== 0 && (
                                <IconButton onClick={() => handlerUp(i)}>
                                  <ArrowUpward />
                                </IconButton>
                              )}
                              {i === 0 && (
                                <IconButton
                                  disabled
                                  onClick={() => handlerUp(i)}>
                                  <ArrowUpward />
                                </IconButton>
                              )}
                            </Grid>
                            <Grid xs={3}>
                              {i < formFull.length - 1 && (
                                <IconButton onClick={() => handlerDown(i)}>
                                  <ArrowDownward />
                                </IconButton>
                              )}
                              {i === formFull.length - 1 && (
                                <IconButton
                                  disabled
                                  onClick={() => handlerDown(i)}>
                                  <ArrowDownward />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
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
                            formFull.push({ step: newOption, form: [] });
                            console.log(formFull);
                            setFlag(true);

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
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default EditForm;
