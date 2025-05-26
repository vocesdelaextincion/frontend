import { Nav, Sidenav, Sidebar } from "rsuite";
import AudioIcon from "@rsuite/icons/Audio";
import TagIcon from "@rsuite/icons/Tag";
import SiteIcon from "@rsuite/icons/Site";
import { Link } from "@tanstack/react-router";
import "./Sidebar.css";

const CustomSidebar = () => {
  return (
    <Sidebar width={260} collapsible className="Sidebar">
      <Sidenav defaultOpenKeys={["3"]} appearance="subtle">
        <Sidenav.Body>
          <Nav defaultActiveKey="1" className="SidebarNav">
            <div className="NavItem">
              <SiteIcon />
              <Link to="/app/dashboard">Inicio</Link>
            </div>
            <div className="NavItem">
              <AudioIcon />
              <Link to="/app/recordings">Grabaciones</Link>
            </div>
            <div className="NavItem">
              <TagIcon />
              <Link to="/app/tags">Etiquetas</Link>
            </div>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};

export default CustomSidebar;
