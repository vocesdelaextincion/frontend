import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  Message,
  toaster,
  SelectPicker,
} from 'rsuite';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

interface FormValues {
  name: string;
  email: string;
  role: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
});

const roleData = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Scientist', value: 'SCIENTIST' },
];

const UpdateUserModal = ({ open, onClose, user }: UpdateUserModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (updatedUser) => api.put(`/users/${user?.id}`, updatedUser as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toaster.push(<Message type="success">User updated successfully.</Message>);
      onClose();
    },
    onError: (error) => {
      toaster.push(<Message type="error">{error.message || 'Failed to update user.'}</Message>);
    },
  });

  if (!user) return null;

  const initialFormValues: FormValues = { name: user.name, email: user.email, role: user.role };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          enableReinitialize
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
                <Form.ControlLabel>Role</Form.ControlLabel>
                <SelectPicker
                  data={roleData}
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  onBlur={handleBlur}
                  block
                />
                {errors.role && touched.role && <Form.HelpText style={{ color: 'red' }}>{errors.role}</Form.HelpText>}
              </Form.Group>

              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" type="submit" loading={isSubmitting}>
                    Update
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

export default UpdateUserModal;
