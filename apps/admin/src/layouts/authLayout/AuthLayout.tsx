import { Outlet } from "@tanstack/react-router";
import CustomSidebar from "../../components/layout/sidebar/Sidebar";
import { Container, Content } from "rsuite";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <Container className="MainContainer">
      <CustomSidebar />
      <Content className="Content">
        <Outlet />
      </Content>
    </Container>
  );
}
