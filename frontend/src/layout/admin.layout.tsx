import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { useState } from "react";
import {
  FaCamera,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaHamburger,
} from "react-icons/fa";
import "./layout.css";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "dashboard",
    icon: <FaHamburger />,
    label: (
      <NavLink to="/admin" className={"!font-normal"} end>
        Dashboard
      </NavLink>
    ),
  },
  {
    key: "products",
    icon: <FaCamera />,
    label: "Products",
    children: [
      {
        key: "create-product",
        label: (
          <NavLink
            to="/admin/create-product"
            className={"admin-sidebar-subitem"}
            end
          >
            Create Products
          </NavLink>
        ),
      },
      {
        key: "view-products",
        label: (
          <NavLink
            to="/admin/view-products"
            className={"admin-sidebar-subitem"}
            end
          >
            View Products
          </NavLink>
        ),
      },
    ],
  },
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/admin/create-product") {
      return ["products", "create-product"];
    } else if (location.pathname === "/admin/view-products") {
      return ["products", "view-products"];
    } else if (location.pathname === "/admin") {
      return ["dashboard"];
    } else {
      return [];
    }
  };

  return (
    <>
      <Layout className="min-h-screen">
        {/* left side */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={300}
          className="bg-white"
          style={{ overflow: "hidden" }}
        >
          <h1 className="px-5 py-3  text-4xl font-bold text-indigo-600">
            {collapsed ? "Lo." : "Logo"}
          </h1>

          {/* Sidebar Menu */}
          <Menu
            className="admin-sidebar-menu"
            mode="inline"
            selectedKeys={getSelectedKey()}
            items={menuItems}
            style={{ height: "100%", fontSize: "15px" }}
          />
        </Sider>

        {/* right side */}
        <Layout className="min-h-screen">
          <Header className="px-0  bg-white border">
            <Button
              type="text"
              icon={
                collapsed ? <FaChevronCircleRight /> : <FaChevronCircleLeft />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <Link to="/" className="float-end mr-10">
              <Button type="primary" size="large">
                HOME
              </Button>
            </Link>
          </Header>

          <Content className="p-10 bg-gray-50">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
