import "./MainLayout.css";
import {
  Container,
  Header,
  Sidebar,
  Content,
  Sidenav,
  Nav,
  Navbar,
  Dropdown,
} from "rsuite";
import { Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Gear, Dashboard, Peoples, Detail, Tag, Exit } from "@rsuite/icons";
import { useAuth } from "../hooks/useAuth";

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(() => {
      navigate({ to: "/login" });
    });
  };

  return (
    <Container className="main-layout-container">
      <Sidebar className="sidebar" width={260} collapsible>
        <Sidenav.Header>
          <div className="sidenav-header">
            <span className="sidenav-header-text">Voces de la Extinción</span>
          </div>
        </Sidenav.Header>
        <Sidenav defaultOpenKeys={["3"]} appearance="inverse">
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                as={Link}
                to="/"
                eventKey="1"
                active={location.pathname === "/"}
                icon={<Dashboard />}
              >
                Panel de Control
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/users"
                eventKey="2"
                active={location.pathname === "/users"}
                icon={<Peoples />}
              >
                Usuarios
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/recordings"
                eventKey="3"
                active={location.pathname === "/recordings"}
                icon={<Detail />}
              >
                Grabaciones
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/tags"
                eventKey="4"
                active={location.pathname === "/tags"}
                icon={<Tag />}
              >
                Etiquetas
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Container>
        <Header>
          <Navbar appearance="inverse">
            <Nav pullRight>
              <Dropdown
                placement="bottomEnd"
                icon={<Gear />}
                title="Administrador"
              >
                <Dropdown.Item icon={<Exit />} onClick={handleLogout}>
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar>
        </Header>
        <Content className="main-content">
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
};

export default MainLayout;
