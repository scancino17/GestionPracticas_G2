import { DropzoneArea } from 'material-ui-dropzone';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import useAuth from '../../providers/Auth';
import { sentReport } from '../../InternshipStates';
import { useHistory } from 'react-router-dom';
function SendReport() {
  const [files, setFiles] = useState([]);
  const { user, userData } = useAuth();
  const history = useHistory();

  function handleSend() {
    console.log(userData);
    console.log(userData.currentInternship.id);
    files.forEach((file) => {
      console.log(file);
      storage
        .ref()
        .child(
          //en la ruta se accede a la carpeta del estudiante luego a las de la intership luego a las de las aplications
          //luego se entra a la de aplication correspondiente, dentro de esta hay carpetas para cada campo de archivos para poder
          //diferenciarlos y finalmente se guardan ahi con su nombre correspondiente
          `/students-docs/${user.uid}/${userData.currentInternship.id}/reports/${userData.currentInternship.id}.pdf`
        )
        .put(file);
    });
    db.collection('internships')
      .doc(userData.currentInternship.id)
      .update({ status: sentReport });
    history.push('/');
  }
  function handleBack() {
    history.push('/');
  }
  return (
    <>
      <div
        style={{
          backgroundImage: "url('../HomeBanner-4x.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Informe de Práctica</Typography>
      </div>
      <Grid container justify='center' alignItems='center' spacing={4}>
        <Grid item xs={8}>
          <DropzoneArea
            filesLimit={1}
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            onChange={(file) => (console.log(file), setFiles(file))}
          />
        </Grid>
      </Grid>
      <Grid container direction='row' justify='flex-end' spacing={3}>
        <Grid item>
          <Button color='primary'>cancelar</Button>
        </Grid>
        <Grid item>
          <Button
            style={{ marginRight: '14rem' }}
            variant='contained'
            disabled={files.length === 0 ? true : false}
            color='primary'
            onClick={() => handleSend()}>
            enviar
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
export default SendReport;
