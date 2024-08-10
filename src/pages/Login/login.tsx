import { Button, Input } from "antd";
import { useState } from "react";
import { useAdmin } from "../../contexts/adminContext";
import CarLogo from "../../images/logo.png";
import "./index.css";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { loadingAdmin, login } = useAdmin();


  const handleLogin = async (username: string, password: string) => {
    const admin = await login(username, password);
    
    if(admin){
        localStorage.setItem('adminId', admin.adminId);
        if(!admin.firstAccess){
          navigate("/home");
        } else {
          navigate('/new-password');
        }
      
    }
  };

  return (
    <div className="background-login">
      <div className="login-div">
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={CarLogo}
            style={{ width: "6rem", marginBottom: "0.5rem" }}
          />
        </div>
        <h4> Informe as credenciais de acesso </h4>
        <div className="login-password-div mt-4">
          <span> Login: </span>
          <Input
            placeholder="Informe o login de acesso"
            className="mt-2 login-password-input"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-password-div mt-3">
          <span> Senha: </span>
          <Input
            placeholder="Informe a senha de acesso"
            className="mt-2 login-password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          className="mt-4 login-password-div login-password-input"
          loading={loadingAdmin}
          onClick={() => handleLogin(username, password)}
        >
          Acessar plataforma
        </Button>
      </div>
    </div>
  );
};
