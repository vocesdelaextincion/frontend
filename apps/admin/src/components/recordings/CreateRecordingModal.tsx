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
import { Formik } from "formik";

import * as Yup from "yup";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tag } from "@packages/types/tag";

interface CreateRecordingModalProps {
  open: boolean;
  onClose: () => void;
}



interface FormValues {
  title: string;
  description: string;
  tagIds: string[];
  recording: FileType | null;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tagIds: Yup.array(),
  recording: Yup.mixed().required("A file is required"),
});

const CreateRecordingModal = ({ open, onClose }: CreateRecordingModalProps) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags"),
  });

  const createRecordingMutation = useMutation<unknown, Error, FormData>({
    mutationFn: (newRecording) =>
      api.post("/recordings", newRecording),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      toaster.push(
        <Message type="success">Recording created successfully.</Message>
      );
      onClose();
    },
    onError: (error) => {
      toaster.push(
        <Message type="error">
          {error.message || "Failed to create recording."}
        </Message>
      );
    },
  });

  const tagData =
    tags?.map((tag) => ({ label: tag.name, value: tag.id })) || [];

  const initialFormValues: FormValues = {
    title: "",
    description: "",
    tagIds: [],
    recording: null,
  };

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
            onSubmit={(values, { setSubmitting }) => {
              if (!values.recording?.blobFile) {
                toaster.push(
                  <Message type="error">A file is required.</Message>
                );
                setSubmitting(false);
                return;
              }

              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);
              formData.append("tagIds", JSON.stringify(values.tagIds));
              formData.append("recording", values.recording.blobFile, values.recording.name);

              createRecordingMutation.mutate(formData, {
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
              <Form fluid>
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
                  <Form.ControlLabel>Recording File</Form.ControlLabel>
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
                      Click or Drag files to this area to upload
                    </div>
                  </Uploader>
                  {errors.recording && touched.recording && (
                    <Form.HelpText style={{ color: "red" }}>
                      {errors.recording}
                    </Form.HelpText>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Tags</Form.ControlLabel>
                  <TagPicker
                    data={tagData}
                    value={values.tagIds}
                    onChange={(value: string[]) =>
                      setFieldValue("tagIds", value)
                    }
                    onBlur={() => handleBlur({ target: { name: "tagIds" } })}
                    block
                  />
                  {errors.tagIds && touched.tagIds && (
                    <Form.HelpText style={{ color: "red" }}>
                      {errors.tagIds}
                    </Form.HelpText>
                  )}
                </Form.Group>

                <Form.Group>
                  <ButtonToolbar>
                    <Button
                      appearance="primary"
                      type="button"
                      loading={isSubmitting}
                      onClick={() => handleSubmit()}
                    >
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
