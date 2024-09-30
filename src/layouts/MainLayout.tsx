import { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import "./MainLayout.css";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  { key: "1", icon: <PieChartOutlined />, label: <Link to="/">Home</Link> },
  {
    key: "2",
    icon: <DesktopOutlined />,
    label: <Link to="/about">About</Link>,
  },
  {
    key: "3",
    icon: <ContainerOutlined />,
    label: <Link to="/contact">Contact</Link>,
  },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "11", label: "Option 11" },
          { key: "12", label: "Option 12" },
        ],
      },
    ],
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
        <div className="logo">My App</div>
        <div
          className="logo-icon"
          style={{ padding: "16px", textAlign: "center" }}
        >
          <GlobalOutlined style={{ fontSize: "24px", color: "white" }} />
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
