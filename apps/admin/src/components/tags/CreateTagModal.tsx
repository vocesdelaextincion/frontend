import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  Message,
  toaster,
} from 'rsuite';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});

const CreateTagModal = ({ open, onClose }: CreateTagModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (newTag) => api.post('/tags', newTag as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toaster.push(<Message type="success">Tag created successfully.</Message>);
      onClose();
    },
    onError: (error) => {
      toaster.push(<Message type="error">{error.message || 'Failed to create tag.'}</Message>);
    },
  });

  const initialFormValues: FormValues = { name: '' };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Create New Tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialFormValues}
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

export default CreateTagModal;
