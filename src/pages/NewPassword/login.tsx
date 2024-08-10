import { Button, Input } from "antd";
import { useState } from "react";
import { useAdmin } from "../../contexts/adminContext";
import CarLogo from "../../images/logo.png";
import "./index.css";
import { useNavigate } from "react-router-dom";

export const NewPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [invalidPasswordAgain, setInvalidPasswordAgain] = useState<boolean>(false);
  const [notEqual, setNotEqual] = useState<boolean>(false);
  const navigate = useNavigate();
  const { loadingAdmin, login, setNewPassword } = useAdmin();


  const handleLogin = async (password: string, repeat: string) => {
    
      if(password.length < 7 || passwordAgain.length < 7){
        setInvalidPassword(true);
      }

      if(password !== repeat){
        setNotEqual(true)
      }

      if(password.length > 7 && passwordAgain.length > 7 && password === repeat){
        setNewPassword(password).then(() => {
            navigate('/home');
         }).catch((err) => {
            console.log(err)
         });
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
        <h4 className="text-center"> Este é o primeiro acesso. Por favor, digite uma nova senha para acessar a plataforma. </h4>
        <div className="login-password-div mt-4">
          <span> Nova senha: </span>
          <Input
            placeholder="Informe a senha de acesso"
            className="mt-2 login-password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-password-div mt-3">
          <span> Repetir senha: </span>
          <Input
            placeholder="Informe a senha de acesso novamente"
            className="mt-2 login-password-input"
            type="password"
            onChange={(e) => { 
              setPasswordAgain(e.target.value)
            }}
          />
        </div>
        <div className="d-flex flex-column mt-2 text-center">
            {invalidPassword && <span style={{color: 'red', fontSize: '1.5rem'}}>
                Insira senhas com no mínimo 8 digitos, por favor.
            </span>}
            {notEqual && <span style={{color: 'red', fontSize: '1.5rem'}}>
                Senhas não confere.
            </span>}
        </div>
        <Button
          type="primary"
          style={{minHeight: '2.5rem'}}
          className="mt-4 login-password-div login-password-input"
          loading={loadingAdmin}
          onClick={() => handleLogin(password, passwordAgain)}
        >
          Acessar plataforma
        </Button>
      </div>
    </div>
  );
};
