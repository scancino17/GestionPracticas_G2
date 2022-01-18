import {
  Button,
  Container,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { functions } from '../firebase';
import { useUser } from '../providers/User';

function MakeAdmin() {
  const { user } = useUser();
  const [name, setName] = useState('');

  function onSubmit() {
    const makeAdmin = functions.httpsCallable('makeAdmin');
    makeAdmin({ uid: user.uid, name: name });
  }

  useEffect(() => console.log(user), [user]);

  return (
    <Container>
      <Grid container direction='column'>
        <Typography variant='h4' style={{ margin: '2rem' }}>
          Convertir en usuario administrador
        </Typography>
        <Typography style={{ margin: '1rem' }}>
          Para convertir la cuenta actual en administrador, ingrese el nombre
          del usuario asociado a esta cuenta en el siguiente campo de texto y
          luego presione en Hacer administrador. El cambio tardará menos de un
          minuto. Después de este tiempo, cierre sesión y vuelva a iniciar
          sesión.
        </Typography>
        <Typography variant='h6' style={{ margin: '1rem' }}>
          ¡IMPORTANTE! Una vez completado el proceso, por favor, elimine o
          comente la línea {'<MakeAdmin />'} del código en src/App.js, para que
          no puedan crearse más administradores.
        </Typography>
        <TextField
          style={{ margin: '2rem' }}
          label='Nombre del usuario administrador'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          disabled={name === ''}
          onClick={onSubmit}>
          Hacer administrador
        </Button>
      </Grid>
    </Container>
  );
}

export default MakeAdmin;
