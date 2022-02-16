import React, { useState } from 'react';
import { useUser } from '../providers/User';
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Hidden,
  Link,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    backgroundImage: 'url(landing-original2.jpg)',
    backgroundSize: 'cover'
  },
  loginBackground: {
    backgroundColor: '#F2F2F2E0',
    borderRadius: '1rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  logo: {
    maxWidth: '22.5rem',
    '@media (max-width: 360px)': {
      maxWidth: '2.5rem'
    },
    '@media (max-width: 350px)': {
      maxWidth: '16.5rem'
    },
    '@media (max-width: 345px)': {
      maxWidth: '15.5rem'
    },
    '@media (max-width: 285px)': {
      maxWidth: '15.5rem'
    },
    '@media (min-width: 371px)': {
      maxWidth: '19.5rem'
    },
    '@media (min-width: 600px)': {
      maxWidth: '15.5rem'
    },
    '@media (min-width: 700px)': {
      maxWidth: '18.5rem'
    },
    '@media (min-width: 800px)': {
      maxWidth: '22.5rem'
    }
  }
});

function Landing() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { login, resetPassword } = useUser();

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
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      className={classes.root}>
      <Grid
        item
        container
        justifyContent='space-evenly'
        alignItems='center'
        xs={10}
        md={8}
        xl={6}
        className={classes.loginBackground}>
        <Grid
          item
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={2}
          xs={12}
          sm={6}>
          <Grid item container justifyContent='center'>
            <img className={classes.logo} src='logo1.png' alt='Logo' />
          </Grid>
          <Grid item>
            <Typography variant='h4' color='primary' align='center'>
              Gestión de Prácticas
            </Typography>
          </Grid>
        </Grid>

        <Hidden mdDown>
          <Divider orientation='vertical' flexItem />
        </Hidden>

        <Grid item container xs={12} sm={6} justifyContent='center'>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {showRecoverPassword ? (
                <Grid
                  container
                  direction='column'
                  spacing='2'
                  alignItems='center'>
                  <Grid item>
                    <Typography variant='h5'>Restablecer contraseña</Typography>
                  </Grid>
                  {showEmailSent && (
                    <Grid item>
                      <Typography color='error'>
                        Se ha enviado un correo para restablecer su contraseña
                      </Typography>
                    </Grid>
                  )}
                  <Grid item>
                    <TextField
                      id='text-input-email'
                      label='Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type='email'
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      color='primary'
                      variant='contained'
                      onClick={() => {
                        resetPassword(email);
                        setShowEmailSent(true);
                      }}>
                      Confirmar
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography>
                      <Link
                        href='#'
                        onClick={() => {
                          setShowRecoverPassword(false);
                          setShowEmailSent(false);
                        }}>
                        Recordé mi contraseña
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <form onSubmit={handleOnSubmit}>
                  <Grid
                    container
                    direction='column'
                    spacing={2}
                    alignItems='center'>
                    <Grid item>
                      <Typography variant='h5' style={{ color: '#002e5e' }}>
                        Iniciar sesión
                      </Typography>
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
                        value={email}
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
                    <Grid item>
                      <Typography>
                        <Link
                          href='#'
                          onClick={() => setShowRecoverPassword(true)}>
                          Olvidé mi contraseña
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Landing;
