import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader,
  Message,
  toaster,
  Grid,
  Row,
  Col,
  Input,
  Button,
  Tag as RsuiteTag,
  Form,
  InputGroup,
  ButtonToolbar,
} from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import api from "../../services/api";
import type { Tag } from "@packages/types/tag";

const toSnakeCase = (str: string) => {
  return str.replace(/\s+/g, "_").toLowerCase();
};

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet';

const rsuiteColors: Color[] = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'];

const getColorForTag = (tagName: string): Color => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % rsuiteColors.length;
  return rsuiteColors[index]!;
};

const TagsPage = () => {
  const [newTagName, setNewTagName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError, error } = useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await api.get("/tags");
      const data = response.data || response;
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    },
  });

  const createMutation = useMutation<Tag, Error, { name: string }>({
    mutationFn: (newTag) => api.post("/tags", newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
            toaster.push(<Message type="success">Etiqueta creada con éxito.</Message>);
      setNewTagName("");
    },
    onError: (err) => {
      toaster.push(
                <Message type="error">{err.message || "Error al crear la etiqueta."}</Message>
      );
    },
  });

  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: (tagId) => api.delete(`/tags/${tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
            toaster.push(<Message type="success">Etiqueta eliminada con éxito.</Message>);
    },
    onError: (err) => {
      toaster.push(
                <Message type="error">{err.message || "Error al eliminar la etiqueta."}</Message>
      );
    },
  });

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createMutation.mutate({ name: toSnakeCase(newTagName.trim()) });
    }
  };

  const handleSortClick = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const displayedTags = useMemo(() => {
    // Ensure tags is always an array
    const safeTags = Array.isArray(tags) ? tags : [];
    let filteredTags = safeTags;

    if (searchQuery) {
      filteredTags = filteredTags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder) {
      filteredTags.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
      });
    }

    return filteredTags;
  }, [tags, searchQuery, sortOrder]);

  if (isLoading) {
        return <Loader center size="lg" content="Cargando..." />;
  }

  if (isError) {
    return <Message type="error">{error.message}</Message>;
  }

  return (
    <div>
            <h2>Etiquetas</h2>
      <Grid fluid>
        <Row gutter={30}>
          <Col xs={12}>
            <div style={{ marginBottom: 20 }}>
              <ButtonToolbar>
                <InputGroup inside>
                                    <Input placeholder="Buscar etiquetas..." value={searchQuery} onChange={setSearchQuery} />
                  <InputGroup.Addon>
                    <SearchIcon />
                  </InputGroup.Addon>
                </InputGroup>
                <Button onClick={handleSortClick}>
                                    Ordenar por Nombre {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
                </Button>
              </ButtonToolbar>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {displayedTags.map((tag) => (
                <RsuiteTag
                  key={tag.id}
                  closable
                  color={getColorForTag(tag.name)}
                  onClose={() => deleteMutation.mutate(tag.id)}
                >
                  {tag.name}
                </RsuiteTag>
              ))}
            </div>
          </Col>
          <Col xs={12}>
            <Form onSubmit={handleCreateTag} fluid>
              <Form.Group controlId="new-tag-name">
                                <Form.ControlLabel>Crear Nueva Etiqueta</Form.ControlLabel>
                <Input
                  value={newTagName}
                  onChange={setNewTagName}
                                    placeholder="Ingrese el nombre de la etiqueta"
                />
              </Form.Group>
              <Button
                type="submit"
                appearance="primary"
                loading={createMutation.isPending}
              >
                                Crear Etiqueta
              </Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default TagsPage;
