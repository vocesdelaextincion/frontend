import { Modal, Button, ButtonToolbar } from 'rsuite';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  isLoading?: boolean;
}

const ConfirmModal = ({ open, onClose, onConfirm, title, body, isLoading }: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button onClick={onConfirm} appearance="primary" color="red" loading={isLoading}>
            Confirm
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
