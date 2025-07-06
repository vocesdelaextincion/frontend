import { Form, ButtonToolbar, Button, Panel, FlexboxGrid, Col, toaster, Message } from 'rsuite';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { useNavigate } from '@tanstack/react-router';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <FlexboxGrid justify="center" align="middle" style={{ height: '100vh' }}>
      <FlexboxGrid.Item as={Col} colspan={6}>
        <Panel header={<h3>Login</h3>} bordered>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await api.post('/auth/login', values);
                login(response.token);
                toaster.push(<Message type="success">Logged in successfully!</Message>);
                navigate({ to: '/' });
              } catch (error) {
                console.error('Login failed:', error);
                toaster.push(<Message type="error">Failed to login. Please check your credentials.</Message>);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, values, handleChange, errors, touched, isSubmitting }) => (
              <Form onSubmit={() => handleSubmit()}>
                <Form.Group>
                  <Form.ControlLabel>Email</Form.ControlLabel>
                  <Form.Control
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(value) => handleChange('email')(String(value))}
                    errorMessage={touched.email && errors.email ? errors.email : null}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Password</Form.ControlLabel>
                  <Form.Control
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={(value) => handleChange('password')(String(value))}
                    errorMessage={touched.password && errors.password ? errors.password : null}
                  />
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="primary" type="submit" loading={isSubmitting}>
                      Submit
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default LoginPage;
