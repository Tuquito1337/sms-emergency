import { useState } from "react";
import {
  CommentOutlined,
  UserOutlined,
  HomeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import "./MainLayout.css";

// Asegúrate de importar la imagen correctamente
import sirenaImage from "/sirena.png"; // Cambia esta ruta según la ubicación de tu imagen

const { Header, Content, Footer, Sider } = Layout;

const items = [
  { key: "1", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to="/profile">Profile</Link>,
  },
  {
    key: "3",
    icon: <CommentOutlined />,
    label: <Link to="/messages">Messages</Link>,
  },
  {
    key: "4",
    icon: <HistoryOutlined />,
    label: <Link to="/history">History</Link>,
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="main-layout">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div
          className="logo-icon"
          style={{ padding: "16px", textAlign: "center" }}
        >
          {/* Usa la imagen en lugar del ícono */}
          <img
            src={sirenaImage}
            alt="Logo"
            style={{ width: "40px", height: "40px" }} // Ajusta el tamaño según sea necesario
          />
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="header">
          <h1>SMS Emergency</h1>
        </Header>
        <Content className="content">
          <div className="site-layout-content">
            <Outlet />
          </div>
        </Content>
        <Footer className="footer">SMS Emergency @2024</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
