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
    files.forEach((file) => {
      storage
        .ref()
        .child(
          `/students-docs/${user.uid}/${userData.currentInternship.id}/reports/${userData.currentInternship.id}.pdf`
        )
        .put(file);
    });
    db.collection('internships')
      .doc(userData.currentInternship.id)
      .update({ status: sentReport });
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

      <Grid container direccion='row' justify='center'>
        <Grid item xs={8}>
          <Grid container direction='column' spacing={4}>
            <Grid>
              <Typography variant='h5' style={{ padding: '2rem 0 0 1rem' }}>
                Sube tu informe aquí
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <DropzoneArea
                filesLimit={1}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                onChange={(file) => setFiles(file)}
              />
            </Grid>

            <Grid item>
              <Grid container direction='row' justify='flex-end' spacing={3}>
                <Grid item>
                  <Button color='primary'>cancelar</Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    disabled={files.length === 0 ? true : false}
                    color='primary'
                    onClick={() => handleSend()}>
                    enviar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
export default SendReport;
