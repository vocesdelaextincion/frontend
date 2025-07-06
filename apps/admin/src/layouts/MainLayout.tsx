import { useState } from 'react';
import { Container, Header, Sidebar, Content, Sidenav, Nav, Navbar, Dropdown } from 'rsuite';
import { Outlet, Link } from '@tanstack/react-router';
import { Icon } from '@rsuite/icons';
import { Gear, Dashboard, Peoples, Detail, Tag, Exit } from '@rsuite/icons';
import { useAuth } from '../hooks/useAuth';

const NavToggle = ({ expand, onChange }: { expand: boolean; onChange: () => void }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Dropdown
          placement="topStart"
          trigger="click"
          renderToggle={(props, ref) => {
            return <Gear {...props} ref={ref} style={{ width: 56, textAlign: 'center' }} />;
          }}
        >
          <Dropdown.Item>Help</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </Nav>

      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          <Icon as={expand ? Peoples : Peoples} />
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const MainLayout = () => {
  const [expand, setExpand] = useState(true);
  const { logout } = useAuth();

  return (
    <Container style={{ height: '100vh' }}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          <div style={{ padding: 18, fontSize: 16, height: 56, background: '#34c3ff', color: ' #fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Icon as={Peoples} style={{ marginRight: 10 }} />
            <span style={{ marginLeft: 12 }}>{expand ? 'Voces de la Extinción' : 'VDE'}</span>
          </div>
        </Sidenav.Header>
        <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item as={Link} to="/" eventKey="1" active icon={<Dashboard />}>
                Dashboard
              </Nav.Item>
              <Nav.Item as={Link} to="/users" eventKey="2" icon={<Peoples />}>
                Users
              </Nav.Item>
              <Nav.Item as={Link} to="/recordings" eventKey="3" icon={<Detail />}>
                Recordings
              </Nav.Item>
              <Nav.Item as={Link} to="/tags" eventKey="4" icon={<Tag />}>
                Tags
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
      <Container>
        <Header>
          <Navbar appearance="subtle">
            <Nav pullRight>
              <Dropdown placement="bottomEnd" icon={<Gear />} title="Admin">
                <Dropdown.Item icon={<Exit />} onClick={logout}>
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar>
        </Header>
        <Content style={{ padding: 20 }}>
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
};

export default MainLayout;
