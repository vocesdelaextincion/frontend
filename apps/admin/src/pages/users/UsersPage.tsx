import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Loader,
  Message,

  ButtonToolbar,
  IconButton,
  toaster,
} from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import type { User } from "@packages/types/user";
import api from "../../services/api";

import UpdateUserModal from "../../components/users/UpdateUserModal";
import ConfirmModal from "../../components/shared/ConfirmModal";

const { Column, HeaderCell, Cell } = Table;

const UsersPage = () => {
  
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => api.get("/admin/users"),
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.push(
        <Message type="success">User deleted successfully.</Message>
      );
      setConfirmOpen(false);
    },
    onError: (err) => {
      toaster.push(
        <Message type="error">
          {err.message || "Failed to delete user."}
        </Message>
      );
      setConfirmOpen(false);
    },
  });

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Users</h2>
        <ButtonToolbar>

        </ButtonToolbar>
      </div>

      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        user={selectedUser}
      />
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        body="Are you sure you want to delete this user? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
      <Table height={400} data={users} autoHeight>
        <Column width={300} sortable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={120} sortable>
          <HeaderCell>Plan</HeaderCell>
          <Cell dataKey="plan" />
        </Column>

        <Column width={120} sortable>
          <HeaderCell>Role</HeaderCell>
          <Cell dataKey="role" />
        </Column>

        <Column width={150} sortable>
          <HeaderCell>Verified</HeaderCell>
          <Cell dataKey="isVerified">
            {(rowData) => (rowData.isVerified ? "Yes" : "No")}
          </Cell>
        </Column>

        <Column width={200} sortable>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {(rowData) => new Date(rowData.createdAt).toLocaleDateString()}
          </Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell>Actions</HeaderCell>
          <Cell>
            {(rowData) => (
              <ButtonToolbar>
                <IconButton
                  icon={<TrashIcon />}
                  color="red"
                  appearance="subtle"
                  onClick={() => handleDeleteClick(rowData as User)}
                />
                <IconButton
                  icon={<EditIcon />}
                  appearance="subtle"
                  onClick={() => handleUpdateClick(rowData as User)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default UsersPage;
