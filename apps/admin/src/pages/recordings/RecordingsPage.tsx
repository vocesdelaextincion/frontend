import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Table,
  Loader,
  Message,
  Button,
  ButtonToolbar,
  IconButton,
  toaster,
  Input,
  InputGroup,
  SelectPicker,
  Pagination,
  FlexboxGrid,
} from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import CopyIcon from "@rsuite/icons/Copy";
import SearchIcon from "@rsuite/icons/Search";
import api, { AuthorizationError } from "../../services/api";
import CreateRecordingModal from "../../components/recordings/CreateRecordingModal";
import UpdateRecordingModal from "../../components/recordings/UpdateRecordingModal";
import ConfirmModal from "../../components/shared/ConfirmModal";
import type { Recording } from "@packages/types/recording";
import type { Tag } from "@packages/types/tag";

const { Column, HeaderCell, Cell } = Table;

interface RecordingsResponse {
  data: Recording[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  search: string | null;
}

const RecordingsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  
  // Search and pagination state
  const [searchInput, setSearchInput] = useState(""); // Input field value
  const [searchTerm, setSearchTerm] = useState(""); // Actual search term for API
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAuthError = useCallback(
    (error: Error) => {
      if (error instanceof AuthorizationError) {
        navigate({ to: "/login" });
        return true;
      }
      return false;
    },
    [navigate]
  );

  // Query for recordings with search and pagination
  const {
    data: recordingsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<RecordingsResponse, Error>({
    queryKey: ["recordings", currentPage, pageSize, searchTerm, selectedTag],
    queryFn: () => {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: pageSize,
      };
      
      const searchValue = selectedTag || searchTerm;
      if (searchValue) {
        params.search = searchValue;
      }
      
      return api.get("/recordings", params);
    },
  });

  // Query for tags for the dropdown
  const { data: tagsResponse } = useQuery<{ data: Tag[] }, Error>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags"),
  });

  useEffect(() => {
    if (isError && error && handleAuthError(error)) {
      return;
    }
  }, [isError, error, handleAuthError]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (recordingId) => api.delete(`/recordings/${recordingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      toaster.push(
        <Message type="success">Recording deleted successfully.</Message>
      );
      setConfirmOpen(false);
    },
    onError: (err) => {
      if (handleAuthError(err)) {
        return;
      }
      toaster.push(
        <Message type="error">
          {err.message || "Failed to delete recording."}
        </Message>
      );
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

  const recordings = recordingsResponse?.data || [];
  const pagination = recordingsResponse?.pagination;
  const tags = tagsResponse?.data || [];

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSelectedTag(null); // Clear tag selection when typing search
  };

  // Handle search on Enter key press
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchTerm(searchInput);
    }
  };

  // Handle tag selection
  const handleTagSelect = (tagName: string | null) => {
    setSelectedTag(tagName);
    setSearchInput(""); // Clear search input when selecting tag
    setSearchTerm(""); // Clear search term when selecting tag
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare tag options for SelectPicker
  const tagOptions = tags.map(tag => ({
    label: tag.name,
    value: tag.name
  }));

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
        <h2>Recordings</h2>
        <ButtonToolbar>
          <Button appearance="primary" onClick={() => setCreateModalOpen(true)}>
            Create Recording
          </Button>
        </ButtonToolbar>
      </div>
      
      {/* Search and Filter Controls */}
      <FlexboxGrid justify="space-between" style={{ marginBottom: "20px" }}>
        <FlexboxGrid.Item colspan={12}>
          <InputGroup inside>
            <Input
              placeholder="Search recordings by title, description, or tags... (Press Enter to search)"
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
            data={tagOptions}
            placeholder="Quick search by tag"
            value={selectedTag}
            onChange={handleTagSelect}
            cleanable
            searchable
            style={{ width: "100%" }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <CreateRecordingModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UpdateRecordingModal
        open={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        recording={selectedRecording}
      />
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Recording"
        body="Are you sure you want to delete this recording? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
      <Table height={400} data={recordings} autoHeight>
        <Column width={200} fixed>
          <HeaderCell>Title</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        <Column width={300}>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>

        <Column width={400}>
          <HeaderCell>File URL</HeaderCell>
          <Cell>
            {(rowData) => {
              const url = (rowData as Recording).fileUrl;
              if (!url) {
                return null;
              }
              const handleCopy = () => {
                navigator.clipboard.writeText(url).then(
                  () => {
                    toaster.push(
                      <Message type="success" closable>
                        URL copied to clipboard.
                      </Message>
                    );
                  },
                  (err) => {
                    toaster.push(
                      <Message type="error" closable>
                        {`Failed to copy URL: ${err.message}`}
                      </Message>
                    );
                  }
                );
              };
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      marginRight: "10px",
                    }}
                  >
                    {url}
                  </a>
                  <IconButton
                    icon={<CopyIcon />}
                    size="lg"
                    appearance="subtle"
                    onClick={handleCopy}
                  />
                </div>
              );
            }}
          </Cell>
        </Column>

        <Column width={200}>
          <HeaderCell>Tags</HeaderCell>
          <Cell dataKey="tags">
            {(rowData) =>
              (rowData.tags || []).map((tag: Tag) => tag.name).join(", ")
            }
          </Cell>
        </Column>

        <Column width={200}>
          <HeaderCell>Created At</HeaderCell>
          <Cell dataKey="createdAt">
            {(rowData) =>
              new Date((rowData as Recording).createdAt).toLocaleDateString()
            }
          </Cell>
        </Column>

        <Column width={200}>
          <HeaderCell>Updated At</HeaderCell>
          <Cell dataKey="updatedAt">
            {(rowData) => new Date(rowData.updatedAt).toLocaleDateString()}
          </Cell>
        </Column>

        <Column width={120} fixed="right">
          <HeaderCell>Actions</HeaderCell>
          <Cell style={{ padding: "6px" }}>
            {(rowData) => (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  appearance="subtle"
                  onClick={() => handleUpdateClick(rowData as Recording)}
                />
                <IconButton
                  icon={<TrashIcon />}
                  size="sm"
                  appearance="subtle"
                  color="red"
                  onClick={() => handleDeleteClick(rowData as Recording)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
      
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="md"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={pagination.totalCount}
            limitOptions={[10, 20, 50]}
            limit={pageSize}
            activePage={currentPage}
            onChangePage={handlePageChange}
            onChangeLimit={setPageSize}
          />
        </div>
      )}
    </div>
  );
};

export default RecordingsPage;
