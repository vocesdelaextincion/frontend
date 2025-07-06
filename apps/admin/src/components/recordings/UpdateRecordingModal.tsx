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
import type { Tag, Recording } from '../../types';

interface UpdateRecordingModalProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
}

interface FormValues {
  name: string;
  url: string;
  tagIds: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  url: Yup.string().url('Invalid URL').required('URL is required'),
  tagIds: Yup.array().of(Yup.string()),
});

const UpdateRecordingModal = ({ open, onClose, recording }: UpdateRecordingModalProps) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: () => api.get('/tags'),
  });

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (updatedRecording) => api.put(`/recordings/${recording?.id}`, updatedRecording as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toaster.push(<Message type="success">Recording updated successfully.</Message>);
      onClose();
    },
    onError: (error) => {
      toaster.push(<Message type="error">{error.message || 'Failed to update recording.'}</Message>);
    },
  });

  if (!recording) return null;

  const tagData = tags?.map(tag => ({ label: tag.name, value: tag.id })) || [];
  const initialFormValues: FormValues = {
    name: recording.name,
    url: recording.url,
    tagIds: recording.tags.map(t => t.id),
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Update Recording</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingTags ? (
          <Loader center content="Loading tags..." />
        ) : (
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
                    name="tagIds"
                    value={values.tagIds}
                    onChange={(value) => setFieldValue('tagIds', value)}
                    onBlur={handleBlur}
                    block
                  />
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateRecordingModal;
