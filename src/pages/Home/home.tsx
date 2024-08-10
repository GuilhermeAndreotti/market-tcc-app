import { useEffect } from "react";
import { useAdmin } from "../../contexts/adminContext";
import "./index.css";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import MarketLogo from "../../images/mercado-livre.svg";
import RegisterLogo from "../../images/car-vector.png";

export const Home = () => {
  const { admin, loadingAdmin } = useAdmin();
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex flex-column" style={{ marginLeft: "1.4rem" }}>
        <span className="vehicle-sub-title" style={{ fontWeight: "700" }}>
          Olá {admin.name}! Seja bem-vindo!
        </span>
        <span className="vehicle-sub-title">
          Esta plataforma foi construída para você registrar e controlar seu
          estoque de veículos. Os cards abaixo mostram as funcionalidades do
          sistema!
        </span>
      </div>
      <div className="d-flex mt-2">
        <>
          {admin.isMaster && (
            <Card
              className="card-vs"
              cover={<img src={MarketLogo} className="image yellow" />}
              actions={[
                <Button
                  type="primary"
                  className="register-btn"
                  style={{ backgroundColor: "#33cc33", width: "80%" }}
                  onClick={() => navigate("/mercado-livre-integration")}
                >
                  Navegar até a página
                </Button>,
              ]}
            >
              <div className="d-flex flex-column">
                Caso desejado, acesse a página de integração para
                adicionar/remover a integrações com o Mercado Livre.
              </div>
            </Card>
          )}
          <Card
            className="card-vs"
            cover={<img src={RegisterLogo} className="image green" />}
            actions={[
              <Button
                type="primary"
                className="register-btn"
                style={{ backgroundColor: "#33cc33", width: "80%" }}
                onClick={() => navigate("/vehicles")}
              >
                Navegar até a página
              </Button>,
            ]}
          >
            <div className="d-flex flex-column">
              Caso desejado, acesse a página de veículos para
              cadastrar/editar/excluir e publicar seus veículos!
            </div>
          </Card>
        </>
      </div>
    </>
  );
};
