import { Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Recording } from "@packages/types/recording";
import type { Tag } from "@packages/types/tag";
import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  Message,
  toaster,
  TagPicker,
  Loader,
  Uploader,
} from "rsuite";
import type { FileType } from "rsuite/Uploader";
import api from "../../services/api";

interface UpdateRecordingModalProps {
  open: boolean;
  onClose: () => void;
  recording: Recording | null;
}

interface FormValues {
  title: string;
  description: string;
  tagIds: string[];
  recording?: FileType | null;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tagIds: Yup.array().of(Yup.string()),
  recording: Yup.mixed().nullable(),
});

const UpdateRecordingModal = ({
  open,
  onClose,
  recording,
}: UpdateRecordingModalProps) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags"),
  });

  const mutation = useMutation<Recording, Error, FormData>({
    mutationFn: (updatedRecording) =>
      api.put(`/recordings/${recording?.id}`, updatedRecording),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      toaster.push(
        <Message type="success">Recording updated successfully.</Message>
      );
      onClose();
    },
    onError: (error) => {
      toaster.push(
        <Message type="error">
          {error.message || "Failed to update recording."}
        </Message>
      );
    },
  });

  if (!recording) return null;

  const tagData =
    tags?.map((tag: Tag) => ({ label: tag.name, value: tag.id })) || [];
  const initialFormValues: FormValues = {
    title: recording.title,
    description: recording.description || "",
    tagIds: recording.tags?.map((tag: Tag) => tag.id) ?? [],
    recording: null,
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
              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);
              formData.append("tagIds", JSON.stringify(values.tagIds));
              

              if (values.recording?.blobFile) {
                formData.append(
                  "recording",
                  values.recording.blobFile,
                  values.recording.name
                );
              }

              mutation.mutate(formData, {
                onSettled: () => setSubmitting(false),
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form fluid onSubmit={() => handleSubmit()}>
                <Form.Group>
                  <Form.ControlLabel>Title</Form.ControlLabel>
                  <Form.Control
                    name="title"
                    onChange={(value: string) => setFieldValue("title", value)}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {errors.title && touched.title && (
                    <Form.HelpText style={{ color: "red" }}>
                      {errors.title}
                    </Form.HelpText>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Description</Form.ControlLabel>
                  <Form.Control
                    name="description"
                    onChange={(value: string) =>
                      setFieldValue("description", value)
                    }
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  {errors.description && touched.description && (
                    <Form.HelpText style={{ color: "red" }}>
                      {errors.description}
                    </Form.HelpText>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Tags</Form.ControlLabel>
                  <TagPicker
                    data={tagData}
                    name="tagIds"
                    value={values.tagIds}
                    onChange={(value) => setFieldValue("tagIds", value)}
                    onBlur={handleBlur}
                    block
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Recording File</Form.ControlLabel>
                  {!values.recording && (
                    <p>
                      Current file:{" "}
                      <a
                        href={recording.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {recording.fileUrl}
                      </a>
                    </p>
                  )}
                  <Uploader
                    action=""
                    draggable
                    autoUpload={false}
                    multiple={false}
                    onChange={(files) => {
                      setFieldValue("recording", files[0]);
                    }}
                    onBlur={() => handleBlur({ target: { name: "recording" } })}
                  >
                    <div
                      style={{
                        lineHeight: "100px",
                      }}
                    >
                      Click or Drag a new file to replace the existing one
                    </div>
                  </Uploader>
                  {errors.recording && touched.recording && (
                    <Form.HelpText style={{ color: "red" }}>
                      {errors.recording}
                    </Form.HelpText>
                  )}
                </Form.Group>

                <Form.Group>
                  <ButtonToolbar>
                    <Button
                      appearance="primary"
                      type="submit"
                      loading={isSubmitting}
                    >
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
