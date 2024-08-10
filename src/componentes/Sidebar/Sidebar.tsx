import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  UserOutlined,
  CarOutlined,
  LogoutOutlined,
  KeyOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CarLogo from "../../images/logo.png";
import { useEffect, useState } from "react";

interface ISidebar {
  collapsed: boolean;
  setCollapsed: any;
}

export const SidebarComponent = ({ collapsed, setCollapsed }: ISidebar) => {
  const navigate = useNavigate();

  const [options, setOptions] = useState([
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    {
      key: "2",
      icon: <CarOutlined />,
      label: "Veículos",
      onClick: () => navigate("/vehicles"),
    },
    {
      key: "3",
      icon: <UsergroupAddOutlined />,
      label: "Administradores",
      onClick: () => navigate("/admins"),
    },
    {
      key: "4",
      icon: <KeyOutlined />,
      label: "Integração",
      onClick: () => navigate("/mercado-livre-integration"),
    },
    {
      key: "5",
      icon: <LogoutOutlined />,
      label: "Sair",
      onClick: () => {
        localStorage.clear();
        navigate("/");
      },
    },
  ]);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId !== process.env.REACT_APP_ADMIN_ID) {
      setOptions(prevOptions => prevOptions.filter(option => option.key !== "3" && option.key !== "4"));
    }
  }, []);

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#33cc33", minWidth: "320px" }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={CarLogo}
            style={{
              width: collapsed ? "4rem" : "6rem",
              marginBottom: collapsed ? "2rem" : "0.5rem",
            }}
          />
        </div>
        <Menu
          theme="light"
          mode="vertical"
          style={{ backgroundColor: "#33cc33" }}
          defaultSelectedKeys={["1"]}
          items={options}
        />
      </Sider>
    </>
  );
};
