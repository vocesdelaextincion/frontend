import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  SelectPicker,
  Message,
  toaster,
} from 'rsuite';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  role: Yup.string().required('Role is required'),
});

const roleData = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
];

const CreateUserModal = ({ open, onClose }: CreateUserModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (newUser) => api.post('/users', newUser as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toaster.push(<Message type="success">User created successfully.</Message>);
      onClose();
    },
    onError: (error) => {
      toaster.push(<Message type="error">{error.message || 'Failed to create user.'}</Message>);
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '', email: '', password: '', role: '' }}
          validationSchema={validationSchema}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            mutation.mutate(values, {
              onSettled: () => setSubmitting(false),
            });
          }}
        >
          {({ values, errors, touched, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form fluid onSubmit={() => handleSubmit()}>
              <Form.Group>
                <Form.ControlLabel>Name</Form.ControlLabel>
                <Form.Control
                  name="name"
                  onChange={(value: string) => setFieldValue('name', value)}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {errors.name && touched.name && <Form.HelpText style={{ color: 'red' }}>{errors.name}</Form.HelpText>}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control
                  name="email"
                  type="email"
                  onChange={(value: string) => setFieldValue('email', value)}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email && <Form.HelpText style={{ color: 'red' }}>{errors.email}</Form.HelpText>}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Password</Form.ControlLabel>
                <Form.Control
                  name="password"
                  type="password"
                  autoComplete="off"
                  onChange={(value: string) => setFieldValue('password', value)}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && <Form.HelpText style={{ color: 'red' }}>{errors.password}</Form.HelpText>}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Role</Form.ControlLabel>
                <SelectPicker
                  data={roleData}
                  searchable={false}
                  value={values.role}
                  onChange={(value: string | null) => setFieldValue('role', value)}
                  onBlur={() => handleBlur({ target: { name: 'role' } })}
                  block
                />
                {errors.role && touched.role && <Form.HelpText style={{ color: 'red' }}>{errors.role}</Form.HelpText>}
              </Form.Group>

              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" type="submit" loading={isSubmitting}>
                    Create
                  </Button>
                  <Button onClick={onClose} appearance="subtle">
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUserModal;

