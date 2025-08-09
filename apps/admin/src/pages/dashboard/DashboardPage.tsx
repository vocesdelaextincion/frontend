import { useQuery } from "@tanstack/react-query";
import { Panel, Col, Row, Loader, Message } from "rsuite";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { PropsWithChildren } from 'react';
import api from "../../services/api";

interface Metrics {
  totalUsers: number;
  totalAdmins: number;
  totalRecordings: number;
  totalTags: number;
}

type DashboardCardProps = PropsWithChildren<{
  to: string;
  header: string;
}>;

const DashboardCard = ({ to, header, children }: DashboardCardProps) => {
  const [isHovered, setHovered] = useState(false);

  const linkStyle = {
    textDecoration: "none",
  };

  const panelStyle = {
    borderColor: isHovered ? "#2575fc" : "#e5e5ea",
    borderWidth: "2px",
  };

  const normalPanelStyle = {
    borderWidth: "1px",
    borderColor: "#e5e5ea",
  };

  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Panel
        bordered
        header={header}
        style={isHovered ? panelStyle : normalPanelStyle}
      >
        {children}
      </Panel>
    </Link>
  );
};

const DashboardPage = () => {
  const {
    data: metrics,
    isLoading,
    isError,
    error,
  } = useQuery<Metrics, Error>({
    queryKey: ["metrics"],
    queryFn: () => api.get("/metrics"),
  });

  if (isLoading) {
        return <Loader center size="lg" content="Cargando..." />;
  }

  if (isError) {
    return <Message type="error">{error.message}</Message>;
  }

  return (
    <div>
            <h2>Panel de Control</h2>
            <p>Bienvenido al panel de administración de Voces de la Extinción.</p>
      {metrics && (
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col md={6}>
                        <DashboardCard to="/users" header="Usuarios">
                            <p>Total de usuarios: {metrics.totalUsers}</p>
            </DashboardCard>
          </Col>
          <Col md={6}>
                        <DashboardCard to="/users" header="Administradores">
                            <p>Total de administradores: {metrics.totalAdmins}</p>
            </DashboardCard>
          </Col>
          <Col md={6}>
                        <DashboardCard to="/recordings" header="Grabaciones">
                            <p>Total de grabaciones: {metrics.totalRecordings}</p>
            </DashboardCard>
          </Col>
          <Col md={6}>
                        <DashboardCard to="/tags" header="Etiquetas">
                            <p>Total de etiquetas: {metrics.totalTags}</p>
            </DashboardCard>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;
