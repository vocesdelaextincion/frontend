import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Loader,
  Message,
  Input,
  InputGroup,
  SelectPicker,
  FlexboxGrid,
  Stack,
  IconButton,
  toaster,
} from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import SearchIcon from "@rsuite/icons/Search";
import type { User } from "@packages/types/user";
import api from "../../services/api";

import UpdateUserModal from "../../components/users/UpdateUserModal";
import ConfirmModal from "../../components/shared/ConfirmModal";

const { Column, HeaderCell, Cell } = Table;

const UsersPage = () => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search and filter state
  const [searchInput, setSearchInput] = useState(""); // Input field value
  const [searchTerm, setSearchTerm] = useState(""); // Actual search term for API
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["users", searchTerm, selectedPlan],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedPlan) {
        params.plan = selectedPlan;
      }

      const response = await api.get("/admin/users", params);
      return response.data;
    },
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.push(
        <Message type="success">Usuario eliminado con éxito.</Message>
      );
      setConfirmOpen(false);
    },
    onError: (err) => {
      toaster.push(
        <Message type="error">
          {err.message || "Error al eliminar el usuario."}
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

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSelectedPlan(null); // Clear plan selection when typing search
  };

  // Handle search on Enter key press
  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setSearchTerm(searchInput);
    }
  };

  // Handle plan filter selection
  const handlePlanSelect = (plan: string | null) => {
    setSelectedPlan(plan);
    setSearchInput(""); // Clear search input when selecting plan
    setSearchTerm(""); // Clear search term when selecting plan
  };

  if (isLoading) {
    return <Loader center size="lg" content="Cargando..." />;
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
        <h2>Usuarios</h2>
        <Stack direction="row" spacing={6}></Stack>
      </div>

      {/* Search and Filter Controls */}
      <FlexboxGrid justify="space-between" style={{ marginBottom: "20px" }}>
        <FlexboxGrid.Item colspan={12}>
          <InputGroup inside>
            <Input
              placeholder="Buscar"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={8}>
          <SelectPicker
            data={[
              { label: "FREE", value: "FREE" },
              { label: "PREMIUM", value: "PREMIUM" },
            ]}
            placeholder="Filtrar por plan"
            value={selectedPlan}
            onChange={handlePlanSelect}
            cleanable
            style={{ width: "100%" }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        user={selectedUser}
      />
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        body="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
        isLoading={deleteMutation.isPending}
      />
      <Table height={400} data={users} autoHeight>
        <Column width={300} sortable>
          <HeaderCell>Correo Electrónico</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={120} sortable>
          <HeaderCell>Plan</HeaderCell>
          <Cell dataKey="plan" />
        </Column>

        <Column width={120} sortable>
          <HeaderCell>Rol</HeaderCell>
          <Cell dataKey="role" />
        </Column>

        <Column width={150} sortable>
          <HeaderCell>Verificado</HeaderCell>
          <Cell dataKey="isVerified">
            {(rowData) => (rowData.isVerified ? "Sí" : "No")}
          </Cell>
        </Column>

        <Column width={200} sortable>
          <HeaderCell>Fecha de Creación</HeaderCell>
          <Cell dataKey="createdAt">
            {(rowData) => new Date(rowData.createdAt).toLocaleDateString()}
          </Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell>Acciones</HeaderCell>
          <Cell>
            {(rowData) => (
              <Stack
                direction="row"
                spacing={6}
                justifyContent="center"
                alignItems="center"
              >
                <IconButton
                  icon={<TrashIcon />}
                  color="red"
                  size="sm"
                  appearance="subtle"
                  onClick={() => handleDeleteClick(rowData as User)}
                />
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  appearance="subtle"
                  onClick={() => handleUpdateClick(rowData as User)}
                />
              </Stack>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default UsersPage;
