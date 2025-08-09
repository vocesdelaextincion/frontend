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
  Grid,
  Row,
  Col,
} from "rsuite";
import type { FileType } from "rsuite/Uploader";
import { Formik } from "formik";
import { useState } from "react";
import { parseBuffer } from "music-metadata";

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
  tags: string[];
  recording: FileType | null;
  metadata?: AudioMetadata | null;
}

interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string[];
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  numberOfChannels?: number;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  tags: Yup.array(),
  recording: Yup.mixed().required("Se requiere un archivo"),
  metadata: Yup.mixed(),
});

const CreateRecordingModal = ({ open, onClose }: CreateRecordingModalProps) => {
  const queryClient = useQueryClient();
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);
  const [extractedMetadata, setExtractedMetadata] =
    useState<AudioMetadata | null>(null);

  const { data: tagsResponse, isLoading: isLoadingTags } = useQuery<
    { data: Tag[] },
    Error
  >({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags"),
  });

  const createRecordingMutation = useMutation<unknown, Error, FormData>({
    mutationFn: (newRecording) => api.post("/recordings", newRecording),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      toaster.push(
        <Message type="success">Grabación creada con éxito.</Message>
      );
      // Reset metadata state
      setExtractedMetadata(null);
      setIsExtractingMetadata(false);
      onClose();
    },
    onError: (error) => {
      toaster.push(
        <Message type="error">
          {error.message || "Error al crear la grabación."}
        </Message>
      );
    },
  });

  const tags = tagsResponse?.data || [];
  const tagData = tags.map((tag) => ({ label: tag.name, value: tag.id }));

  const extractMetadata = async (file: File) => {
    setIsExtractingMetadata(true);
    try {
      const buffer = await file.arrayBuffer();
      const metadata = await parseBuffer(new Uint8Array(buffer));

      const extractedData: AudioMetadata = {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        genre: metadata.common.genre,
        duration: metadata.format.duration,
        bitrate: metadata.format.bitrate,
        sampleRate: metadata.format.sampleRate,
        numberOfChannels: metadata.format.numberOfChannels,
      };

      setExtractedMetadata(extractedData);
      return extractedData;
    } catch (error) {
      console.error("Error extracting metadata:", error);
      toaster.push(
        <Message type="warning">
          No se pudo extraer metadata del archivo.
        </Message>
      );
      return null;
    } finally {
      setIsExtractingMetadata(false);
    }
  };

  const initialFormValues: FormValues = {
    title: "",
    description: "",
    tags: [],
    recording: null,
    metadata: null,
  };

  const handleClose = () => {
    // Reset metadata state when modal closes
    setExtractedMetadata(null);
    setIsExtractingMetadata(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Crear Nueva Grabación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingTags ? (
          <Loader center content="Cargando etiquetas..." />
        ) : (
          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (!values.recording?.blobFile) {
                toaster.push(
                  <Message type="error">Se requiere un archivo.</Message>
                );
                setSubmitting(false);
                return;
              }

              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);
              formData.append("tags", JSON.stringify(values.tags));
              formData.append(
                "metadata",
                JSON.stringify(values.metadata || extractedMetadata)
              );
              formData.append(
                "recording",
                values.recording.blobFile,
                values.recording.name
              );

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
              <Grid fluid>
                <Row>
                  <Col xs={extractedMetadata ? 16 : 24}>
                    <Form fluid>
                      <Form.Group>
                        <Form.ControlLabel>Título</Form.ControlLabel>
                        <Form.Control
                          name="title"
                          onChange={(value: string) =>
                            setFieldValue("title", value)
                          }
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
                        <Form.ControlLabel>Descripción</Form.ControlLabel>
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
                        <Form.ControlLabel>
                          Archivo de Grabación
                        </Form.ControlLabel>
                        <Uploader
                          action=""
                          draggable
                          autoUpload={false}
                          multiple={false}
                          onChange={async (files) => {
                            const file = files[0];
                            setFieldValue("recording", file);

                            if (file?.blobFile) {
                              const metadata = await extractMetadata(
                                file.blobFile
                              );
                              setFieldValue("metadata", metadata);
                            }
                          }}
                          onBlur={() =>
                            handleBlur({ target: { name: "recording" } })
                          }
                        >
                          <div
                            style={{
                              lineHeight: "100px",
                            }}
                          >
                            Haga clic o arrastre los archivos a esta área para
                            subirlos
                          </div>
                        </Uploader>
                        {isExtractingMetadata && (
                          <div style={{ marginTop: "8px" }}>
                            <Loader
                              size="sm"
                              content="Extrayendo metadata..."
                            />
                          </div>
                        )}
                        {errors.recording && touched.recording && (
                          <Form.HelpText style={{ color: "red" }}>
                            {errors.recording}
                          </Form.HelpText>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.ControlLabel>Etiquetas</Form.ControlLabel>
                        <TagPicker
                          data={tagData}
                          value={values.tags}
                          onChange={(value: string[]) =>
                            setFieldValue("tags", value)
                          }
                          onBlur={() =>
                            handleBlur({ target: { name: "tags" } })
                          }
                          block
                        />
                        {errors.tags && touched.tags && (
                          <Form.HelpText style={{ color: "red" }}>
                            {errors.tags}
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
                            Crear
                          </Button>
                          <Button onClick={handleClose} appearance="subtle">
                            Cancelar
                          </Button>
                        </ButtonToolbar>
                      </Form.Group>
                    </Form>
                  </Col>
                  {extractedMetadata && (
                    <Col xs={8}>
                      <div style={{ padding: "0 16px" }}>
                        <h6
                          style={{
                            marginBottom: "12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Metadata del Archivo
                        </h6>
                        <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                          {extractedMetadata.title && (
                            <div>
                              <strong>Título:</strong> {extractedMetadata.title}
                            </div>
                          )}
                          {extractedMetadata.artist && (
                            <div>
                              <strong>Artista:</strong>{" "}
                              {extractedMetadata.artist}
                            </div>
                          )}
                          {extractedMetadata.album && (
                            <div>
                              <strong>Álbum:</strong> {extractedMetadata.album}
                            </div>
                          )}
                          {extractedMetadata.year && (
                            <div>
                              <strong>Año:</strong> {extractedMetadata.year}
                            </div>
                          )}
                          {extractedMetadata.genre &&
                            extractedMetadata.genre.length > 0 && (
                              <div>
                                <strong>Género:</strong>{" "}
                                {extractedMetadata.genre.join(", ")}
                              </div>
                            )}
                          {extractedMetadata.duration && (
                            <div>
                              <strong>Duración:</strong>{" "}
                              {Math.round(extractedMetadata.duration)}s
                            </div>
                          )}
                          {extractedMetadata.bitrate && (
                            <div>
                              <strong>Bitrate:</strong>{" "}
                              {extractedMetadata.bitrate} kbps
                            </div>
                          )}
                          {extractedMetadata.sampleRate && (
                            <div>
                              <strong>Sample Rate:</strong>{" "}
                              {extractedMetadata.sampleRate} Hz
                            </div>
                          )}
                          {extractedMetadata.numberOfChannels && (
                            <div>
                              <strong>Canales:</strong>{" "}
                              {extractedMetadata.numberOfChannels}
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Grid>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreateRecordingModal;
