import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Loader, Message, TagGroup, Tag as RSuiteTag, Button, ButtonToolbar, IconButton, toaster } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import api from '../../services/api';
import CreateRecordingModal from '../../components/recordings/CreateRecordingModal';
import UpdateRecordingModal from '../../components/recordings/UpdateRecordingModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import type { Tag, Recording } from '../../types';

const { Column, HeaderCell, Cell } = Table;

const RecordingsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  const queryClient = useQueryClient();

  const { data: recordings, isLoading, isError, error } = useQuery<Recording[], Error>({
    queryKey: ['recordings'],
    queryFn: () => api.get('/recordings'),
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (recordingId) => api.delete(`/recordings/${recordingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toaster.push(<Message type="success">Recording deleted successfully.</Message>);
      setConfirmOpen(false);
    },
    onError: (err) => {
      toaster.push(<Message type="error">{err.message || 'Failed to delete recording.'}</Message>);
      setConfirmOpen(false);
    },
  });

  const handleUpdateClick = (recording: Recording) => {
    setSelectedRecording(recording);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (recording: Recording) => {
    setSelectedRecording(recording);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRecording) {
      deleteMutation.mutate(selectedRecording.id);
    }
  };

  if (isLoading) {
    return <Loader center size="lg" content="Loading..." />;
  }

  if (isError) {
    return <Message type="error">{error.message}</Message>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Recordings</h2>
        <ButtonToolbar>
          <Button appearance="primary" onClick={() => setCreateModalOpen(true)}>Create Recording</Button>
        </ButtonToolbar>
      </div>
      <CreateRecordingModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      <UpdateRecordingModal open={isUpdateModalOpen} onClose={() => setUpdateModalOpen(false)} recording={selectedRecording} />
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Recording"
        body="Are you sure you want to delete this recording? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
      <Table
        height={400}
        data={recordings}
        autoHeight
      >
        <Column width={250} fixed>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        <Column width={200}>
          <HeaderCell>Scientist</HeaderCell>
          <Cell dataKey="scientist" />
        </Column>

        <Column width={300}>
          <HeaderCell>Tags</HeaderCell>
          <Cell dataKey="tags">
            {(rowData) => (
              <TagGroup>
                {rowData.tags.map((tag: Tag) => (
                  <RSuiteTag key={tag.id}>{tag.name}</RSuiteTag>
                ))}
              </TagGroup>
            )}
          </Cell>
        </Column>

        <Column width={200}>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {rowData => new Date((rowData as Recording).createdAt).toLocaleDateString()}
          </Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell>Actions</HeaderCell>
          <Cell>
            {rowData => (
              <ButtonToolbar>
                <IconButton
                  icon={<TrashIcon />}
                  color="red"
                  appearance="subtle"
                  onClick={() => handleDeleteClick(rowData as Recording)}
                />
                <IconButton
                  icon={<EditIcon />}
                  appearance="subtle"
                  onClick={() => handleUpdateClick(rowData as Recording)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default RecordingsPage;
