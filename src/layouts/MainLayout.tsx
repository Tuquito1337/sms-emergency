// src/layouts/MainLayout.jsx
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import "./MainLayout.css"; // Importamos el archivo CSS para los estilos

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  return (
    <Layout className="main-layout">
      <Sider collapsible className="sider">
        <div className="logo">My App</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/about">About</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/contact">Contact</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <h1>Welcome to My App</h1>
        </Header>
        <Content className="content">
          <div className="site-layout-content">
            <Outlet />
          </div>
        </Content>
        <Footer className="footer">My App ©2024 Created by Me</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
