import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Loader, Message, Button, ButtonToolbar, IconButton, toaster } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import api from '../../services/api';
import CreateTagModal from '../../components/tags/CreateTagModal';
import UpdateTagModal from '../../components/tags/UpdateTagModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import type { Tag } from '../../types';

const { Column, HeaderCell, Cell } = Table;

const TagsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError, error } = useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: () => api.get('/tags'),
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (tagId) => api.delete(`/tags/${tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toaster.push(<Message type="success">Tag deleted successfully.</Message>);
      setConfirmOpen(false);
    },
    onError: (err) => {
      toaster.push(<Message type="error">{err.message || 'Failed to delete tag.'}</Message>);
      setConfirmOpen(false);
    },
  });

  const handleUpdateClick = (tag: Tag) => {
    setSelectedTag(tag);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (tag: Tag) => {
    setSelectedTag(tag);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTag) {
      deleteMutation.mutate(selectedTag.id);
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
        <h2>Tags</h2>
        <ButtonToolbar>
          <Button appearance="primary" onClick={() => setCreateModalOpen(true)}>Create Tag</Button>
        </ButtonToolbar>
      </div>
      <CreateTagModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      <UpdateTagModal open={isUpdateModalOpen} onClose={() => setUpdateModalOpen(false)} tag={selectedTag} />
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Tag"
        body="Are you sure you want to delete this tag? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
      <Table
        height={400}
        data={tags}
        autoHeight
      >
        <Column width={300} sortable fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={200}>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {rowData => new Date((rowData as Tag).createdAt).toLocaleDateString()}
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
                  onClick={() => handleDeleteClick(rowData as Tag)}
                />
                <IconButton
                  icon={<EditIcon />}
                  appearance="subtle"
                  onClick={() => handleUpdateClick(rowData as Tag)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default TagsPage;
