import React from 'react';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as yup from 'yup';

import { LOGIN_MUTATION } from '../api';
import { useAuth } from '../AuthProvider';

import {
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
} from '@mui/material';

type LoginValues = {
  identifier: string;
  password: string;
};

type SubmitActions = {
  setSubmitting: (isSubmitting: boolean) => void;
};

const LoginPage = () => {
  const { login } = useAuth();
  const [loginMutation, { loading, error, reset }] =
    useMutation(LOGIN_MUTATION);

  const handleLogin = (
    values: LoginValues,
    { setSubmitting }: SubmitActions
  ) => {
    loginMutation({ variables: { input: values } })
      .then(({ data }) => {
        login(data.login.jwt, data.login.user);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const validationSchema = yup.object({
    identifier: yup
      .string()
      .email('Please enter a valid e-mail address')
      .required('Should not be empty'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Should not be empty'),
  });

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={10} sm={8} md={5}>
          <Formik
            initialValues={{ identifier: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <Stack
                spacing={4}
                component="form"
                paddingY="180px"
                onSubmit={handleSubmit}
              >
                <Typography variant="h4" component="h1" align="center">
                  Login
                </Typography>
                <TextField
                  variant="outlined"
                  label="Email"
                  type="email"
                  name="identifier"
                  onChange={(e) => {
                    handleChange(e);
                    reset();
                  }}
                  value={values.identifier}
                  error={(touched.identifier && !!errors.identifier) || !!error}
                  helperText={
                    (touched.identifier && errors.identifier) || error?.message
                  }
                />
                <TextField
                  variant="outlined"
                  label="Password"
                  type="password"
                  name="password"
                  onChange={(e) => {
                    handleChange(e);
                    reset();
                  }}
                  value={values.password}
                  error={(touched.password && !!errors.password) || !!error}
                  helperText={
                    (touched.password && errors.password) || error?.message
                  }
                />
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={isSubmitting}
                >
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </Stack>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
