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
import type { Tag } from '@packages/types/tag';

interface UpdateTagModalProps {
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
}

interface FormValues {
  name: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
});

const UpdateTagModal = ({ open, onClose, tag }: UpdateTagModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (updatedTag) => api.put(`/tags/${tag?.id}`, updatedTag as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
            toaster.push(<Message type="success">Etiqueta actualizada con éxito.</Message>);
      onClose();
    },
    onError: (error) => {
            toaster.push(<Message type="error">{error.message || 'Error al actualizar la etiqueta.'}</Message>);
    },
  });

  if (!tag) return null;

  const initialFormValues: FormValues = { name: tag.name };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
                <Modal.Title>Actualizar Etiqueta</Modal.Title>
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
                                <Form.ControlLabel>Nombre</Form.ControlLabel>
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
                    Actualizar
                  </Button>
                  <Button onClick={onClose} appearance="subtle">
                    Cancelar
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

export default UpdateTagModal;
