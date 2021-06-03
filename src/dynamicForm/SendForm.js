import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import { db, storage } from '../firebase';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Container
} from '@material-ui/core';
import useAuth from '../providers/Auth';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { sentApplication } from '../InternshipStates';
import { ContactsOutlined } from '@material-ui/icons';

function SendForm({ edit }) {
  const [formFull, setFormFull] = useState([]);
  const [flag, setFlag] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { user, userData } = useAuth();
  const [files, setFiles] = useState([]);
  const { applicationId } = useParams();
  const history = useHistory();
  const [internshipId, setInternshipId] = useState();

  useEffect(() => {
    if (userData) {
      setInternshipId(userData.currentInternship.id);
      if (!edit) {
        db.collection('form')
          .doc(userData.careerId)
          .get()
          .then((doc) => {
            const data = doc.data();
            if (data) setFormFull(data.form);
          });
      } else {
        db.collection('applications')
          .doc(applicationId)
          .get()
          .then((doc) => {
            const data = doc.data();
            if (data) setFormFull(data.form);
          });
      }
      db.collection('internships')
        .doc(userData.currentInternship.id)
        .update({ status: sentApplication });
    }
  }, [userData]);
  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  //se extraen los archivos del formfull para tenerlos en una lista aparte para poder subirlos al storage
  function extractFiles() {
    formFull.map((step, i) =>
      step.form.map((camp, j) => {
        if (camp.type === 'File') {
          if (camp.value) {
            files.push({ campName: camp.name, file: camp.value[0] });
            //se tiene que cambiar el valor de value en el formulario ya que nos se puede guardar un archivo en el firestore
            //tambien ese name sirve para poder buscar el archivo
            formFull[i].form[j].value = camp.value[0].name;
          }
        }
      })
    );
  }
  //se guardan los archivos en el storage
  function saveFiles(applicationId) {
    files.map((file) => {
      storage
        .ref()
        .child(
          //en la ruta se accede a la carpeta del estudiante luego a las de la intership luego a las de las aplications
          //luego se entra a la de aplication correspondiente, dentro de esta hay carpetas para cada campo de archivos para poder
          //diferenciarlos y finalmente se guardan ahi con su nombre correspondiente
          `/students-docs/${user.uid}/${internshipId}/applications/${applicationId}/${file.campName}/${file.file.name}`
        )
        .put(file.file);
    });
  }
  function handleSave() {
    if (!edit) {
      //extraemos los archivos antes de guardar el formulario para poder cambiar el valor del value en los campos files ya que
      //firestore no lo soporta
      extractFiles();
      db.collection('applications')
        .add({
          form: formFull,
          student: user.uid,
          email: userData.email,
          careerId: userData.careerId,
          internship: internshipId
        })
        .then(function (docRef) {
          //se guarda los archivos en la application correspondiente
          saveFiles(docRef.id);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    } else {
      db.collection('applications').doc(applicationId).set({
        form: formFull,
        student: user.uid
      });
    }
  }

  return (
    <Container>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{ margin: '2rem' }}>
        {formFull.map((step) => (
          <Step key={step.step}>
            <StepLabel>{step.step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === formFull.length ? (
        <>
          <Typography>Guardar</Typography>
          <Button variant='contained' color='primary' onClick={handleSave}>
            Guardar
          </Button>
        </>
      ) : (
        <>
          {formFull.map(
            (form, i) =>
              i === activeStep && (
                // formview
                <DynamicForm
                  form={form.form}
                  setForm={setFormFull}
                  formFull={formFull}
                  index={i}
                  filesInner={files}
                  setFilesInner={() => setFiles}
                  student
                />
              )
          )}
          <Button variant='contained' color='primary' onClick={extractFiles}>
            Save File
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={activeStep === 0}
            onClick={handleBack}>
            Anterior
          </Button>
          {activeStep !== formFull.length - 1 && (
            <Button variant='contained' color='primary' onClick={handleNext}>
              Siguiente
            </Button>
          )}
          {activeStep === formFull.length - 1 && (
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                Swal.fire({
                  title: '¿Desea enviar su solicitud?',
                  showDenyButton: true,
                  confirmButtonText: `Enviar`,
                  denyButtonText: `Salir`
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleSave();
                    Swal.fire('¡Formulario enviado!', '', 'success').then(
                      (result) => {
                        if (result.isConfirmed) history.push('/');
                      }
                    );
                  } else if (result.isDenied) {
                    Swal.fire(
                      'Revisa bien tu formulario antes de enviarlo',
                      '',
                      'info'
                    );
                  }
                });
              }}>
              Enviar
            </Button>
          )}
        </>
      )}
    </Container>
  );
}

export default SendForm;
