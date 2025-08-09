import { Modal } from "rsuite";

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

interface MetadataViewerModalProps {
  open: boolean;
  onClose: () => void;
  metadata: AudioMetadata | null;
  recordingTitle: string;
}

const MetadataViewerModal = ({ 
  open, 
  onClose, 
  metadata, 
  recordingTitle 
}: MetadataViewerModalProps) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>Metadata - {recordingTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {metadata ? (
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {metadata.title && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Título:</strong> {metadata.title}
              </div>
            )}
            {metadata.artist && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Artista:</strong> {metadata.artist}
              </div>
            )}
            {metadata.album && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Álbum:</strong> {metadata.album}
              </div>
            )}
            {metadata.year && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Año:</strong> {metadata.year}
              </div>
            )}
            {metadata.genre && metadata.genre.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Género:</strong> {metadata.genre.join(', ')}
              </div>
            )}
            {metadata.duration && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Duración:</strong> {Math.round(metadata.duration)}s
              </div>
            )}
            {metadata.bitrate && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Bitrate:</strong> {metadata.bitrate} kbps
              </div>
            )}
            {metadata.sampleRate && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Sample Rate:</strong> {metadata.sampleRate} Hz
              </div>
            )}
            {metadata.numberOfChannels && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Canales:</strong> {metadata.numberOfChannels}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontStyle: 'italic',
            padding: '20px 0'
          }}>
            No hay metadata disponible para esta grabación.
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MetadataViewerModal;
