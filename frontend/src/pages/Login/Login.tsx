import React, { FC } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik, Field, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import {useAuth} from '../../authentication/authContext'
import { useNavigate } from 'react-router-dom';

interface formValues{
  username: string
  password: string
}


const Login: FC = () => {
  const {login} = useAuth()
  // const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: formValues,
    { setSubmitting }: FormikHelpers<formValues>
  ) => {
    try {
      console.log('Form submit called, values:', values);
      const response = await axios.post('http://localhost:3000/api/login', values, {
        headers: {
          'Content-Type': 'application/json',
        },
          });

      

      const data = await response.data;
      console.log('Response from server:', data);
      login(data.token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response from server:', error.response?.data);
      } 
      else{
      console.error('Login failed', error);
      }
    }  
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your details to view dashboard.
        </p>
      </div>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }: FormikProps<formValues>) => (
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Field type="username" name="username" as={Form.Control} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Field type="password" name="password" as={Form.Control} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-full bg-indigo-500">
              Sign In
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;