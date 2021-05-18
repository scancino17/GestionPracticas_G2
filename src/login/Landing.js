import React, { Fragment, useState } from 'react';
import useAuth from '../providers/Auth';
import {
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';

function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { login } = useAuth();

  function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    login(email, password)
      .then(() => setLoading(false))
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  return (
    <div style={{ backgroundImage: 'url(Fondo.png)' }}>
      <Container>
        <Grid
          container
          direction='column'
          justify='center'
          style={{ height: '100vh' }}>
          <Grid
            item
            container
            justify='center'
            alignItems='center'
            style={{
              backgroundColor: '#F2F2F2D0',
              borderRadius: '1rem',
              padding: '3rem'
            }}>
            <Grid
              item
              container
              direction='column'
              justify='center'
              spacing={1}
              xs={12}
              sm={6}>
              <Grid item>
                <img src='logo.png' alt='Logo' />
              </Grid>
              <Grid item>
                <Typography variant='h3'>Gestión de Prácticas</Typography>
              </Grid>
              <Grid item>
                <Typography variant='h4' gutterBottom>
                  Universidad de Talca
                </Typography>
              </Grid>
            </Grid>

            <Divider orientation='vertical' flexItem />

            <Grid item container xs={12} sm={6} justify='center'>
              {loading ? (
                <CircularProgress />
              ) : (
                <form onSubmit={handleOnSubmit}>
                  <Grid
                    container
                    direction='column'
                    spacing={2}
                    alignItems='center'>
                    <Grid item>
                      <Typography variant='h5'>Iniciar sesión</Typography>
                    </Grid>
                    {error && (
                      <Grid item>
                        <Typography color='error'>
                          Error iniciando sesión. Por favor revise sus
                          credenciales.
                        </Typography>
                      </Grid>
                    )}
                    <Grid item>
                      <TextField
                        id='text-input-email'
                        label='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type='email'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id='text-input-password'
                        label='Contraseña'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type='password'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item>
                      <Button color='primary' type='submit' variant='contained'>
                        Ingresar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Landing;
