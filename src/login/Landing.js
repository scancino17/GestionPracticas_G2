import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  Heading,
  Main,
  Spinner,
  Text,
  TextInput
} from 'grommet';
import { useAuth } from '../providers/Auth';

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
      .then((userCredential) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setError(true);
        setLoading(false);
      });
  }

  return (
    <Main
      background="url('Fondo.png')"
      direction='row-responsive'
      pad='medium'
      justify='evenly'>
      <Box justify='center' align='baseline' margin='medium'>
        <Heading margin='small' level='1'>
          Gestión de Prácticas
        </Heading>
        <Heading margin='small' level='2'>
          Universidad de Talca
        </Heading>
      </Box>
      <Box justify='center'>
        <Card
          width='medium'
          background={{ opacity: 'strong', color: 'light-1' }}>
          {loading ? (
            <Box align='center'>
              <Spinner margin='medium' size='large' />
            </Box>
          ) : (
            <>
              <CardHeader justify='center'>
                <Heading level='3'>Iniciar sesión</Heading>
              </CardHeader>
              <Form onSubmit={handleOnSubmit}>
                <CardBody pad='medium'>
                  {error && (
                    <Text margin='small' color='status-critical'>
                      Error iniciando sesión. Por favor revise sus credenciales.
                    </Text>
                  )}
                  <FormField
                    name='email'
                    htmlFor='text-input-email'
                    label='Email'
                    required>
                    <TextInput
                      id='text-input-email'
                      name='email'
                      type='email'
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormField>
                  <FormField
                    name='password'
                    htmlFor='text-input-password'
                    label='Contraseña'
                    required>
                    <TextInput
                      id='text-input-password'
                      name='password'
                      type='password'
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormField>
                </CardBody>
                <CardFooter pad='small' justify='center'>
                  <Button
                    type='submit'
                    primary
                    label='Ingresar'
                    color='brand'
                  />
                </CardFooter>
              </Form>
            </>
          )}
        </Card>
      </Box>
    </Main>
  );
}

export default Landing;
