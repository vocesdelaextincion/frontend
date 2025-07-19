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
import { Outlet, Link } from "@tanstack/react-router";
import { Icon } from "@rsuite/icons";
import { Gear, Dashboard, Peoples, Detail, Tag, Exit } from "@rsuite/icons";
import { useAuth } from "../hooks/useAuth";

const MainLayout = () => {
  const { logout } = useAuth();

  return (
    <Container className="main-layout-container">
      <Sidebar className="sidebar" width={260} collapsible>
        <Sidenav.Header>
          <div className="sidenav-header">
            <Icon as={Peoples} className="sidenav-header-icon" />
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
                active
                icon={<Dashboard />}
              >
                Dashboard
              </Nav.Item>
              <Nav.Item as={Link} to="/users" eventKey="2" icon={<Peoples />}>
                Users
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/recordings"
                eventKey="3"
                icon={<Detail />}
              >
                Recordings
              </Nav.Item>
              <Nav.Item as={Link} to="/tags" eventKey="4" icon={<Tag />}>
                Tags
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Container>
        <Header>
          <Navbar appearance="inverse">
            <Nav pullRight>
              <Dropdown placement="bottomEnd" icon={<Gear />} title="Admin">
                <Dropdown.Item icon={<Exit />} onClick={logout}>
                  Logout
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
