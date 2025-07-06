import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  Message,
  toaster,
  TagPicker,
  Loader,
} from 'rsuite';
import { Formik } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tag } from '../../types';

interface CreateRecordingModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  url: string;
  tagIds: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  url: Yup.string().url('Must be a valid URL').required('URL is required'),
  tagIds: Yup.array().min(1, 'At least one tag is required'),
});

const CreateRecordingModal = ({ open, onClose }: CreateRecordingModalProps) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => api.get('/tags'),
  });

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (newRecording) => api.post('/recordings', newRecording as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toaster.push(<Message type="success">Recording created successfully.</Message>);
      onClose();
    },
    onError: (error) => {
      toaster.push(<Message type="error">{error.message || 'Failed to create recording.'}</Message>);
    },
  });

  const tagData = tags?.map(tag => ({ label: tag.name, value: tag.id })) || [];

  const initialFormValues: FormValues = { name: '', url: '', tagIds: [] };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Create New Recording</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingTags ? (
          <Loader center content="Loading tags..." />
        ) : (
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
                  <Form.ControlLabel>URL</Form.ControlLabel>
                  <Form.Control
                    name="url"
                    onChange={(value: string) => setFieldValue('url', value)}
                    onBlur={handleBlur}
                    value={values.url}
                  />
                  {errors.url && touched.url && <Form.HelpText style={{ color: 'red' }}>{errors.url}</Form.HelpText>}
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Tags</Form.ControlLabel>
                  <TagPicker
                    data={tagData}
                    value={values.tagIds}
                    onChange={(value: string[]) => setFieldValue('tagIds', value)}
                    onBlur={() => handleBlur({ target: { name: 'tagIds' } })}
                    block
                  />
                  {errors.tagIds && touched.tagIds && <Form.HelpText style={{ color: 'red' }}>{errors.tagIds}</Form.HelpText>}
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreateRecordingModal;
