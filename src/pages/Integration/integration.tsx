import { KeyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import MarketLogo from "../../images/mercado-livre.svg";
import "./index.css";

export const Integration = () => {
  const {
    loadingToken,
    getMLBToken,
    checkToken,
    admin,
    removeConnection,
    getAdminById,
    loadingAdmin
  } = useAdmin();
  const navigate = useNavigate();

  const handleIntegration = () => {
    if (!admin.accessToken) {
      const marketUrl = process.env.REACT_APP_MERCADO_LIVRE_URL;
      const frontUrl = process.env.REACT_APP_REDIRECT_URL;
      if (marketUrl && frontUrl) {
        window.location.href =
          marketUrl + frontUrl + "/mercado-livre-integration";
      }
    } else {
      disconnectMlb();
    }
  };

  const saveMlbAccessToken = async (code: string) => {
    await getMLBToken(code);
    window.location.href = '/mercado-livre-integration'

  };

  const disconnectMlb = async () => {
    await removeConnection();
    window.location.href = '/mercado-livre-integration'
  };

  useEffect(() => {

    if (admin.isMaster && !admin.accessToken) {
      const url = window.location.href;
      console.log(url)
      const match = url.match(/code=([^&]*)/);
      if (match) {
        const code = match[1];
        console.log('Conectando...')
        saveMlbAccessToken(code);
      }
    }
  }, [admin]);

  return (
    <div>
      <div className="vehicles-div">
        <div className="vehicle-content">
          <span className="vehicle-title">
            <KeyOutlined /> Integração
          </span>
        </div>
      </div>

      <div className="d-flex flex-column mb-3">
        <span className="vehicle-sub-title">
          Nesta tela, você pode realizar a integração com o Mercado Livre. Leia
          as instruções abaixo para que tudo fique claro.
        </span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="vehicle-sub-title" style={{ fontWeight: "700" }}>
          {" "}
          Permissões{" "}
        </span>
        <span className="vehicle-sub-title">
          Somente você pode acessar esta tela para{" "}
          <b>conectar e desconectar a integração</b>. No entanto, você pode
          permitir que outros administradores utilizem a integração,
          permitindo-lhes{" "}
          <b style={{ color: "red" }}>publicar, excluir e editar</b> os anúncios
          livremente.{" "}
          <a
            style={{ color: "green", textDecoration: "underline" }}
            onClick={() => navigate("/admins")}
          >
            Clique aqui para configurar essas permissões.
          </a>
        </span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="vehicle-sub-title" style={{ fontWeight: "700" }}>
          {" "}
          Integração{" "}
        </span>
        <span className="vehicle-sub-title">
          Clique no botão abaixo para ser redirecionado ao Mercado Livre. Lá,
          você precisará conectar sua conta com a aplicação. Após isso, tudo
          estará pronto para uso! Lembre-se: se você ficar muito tempo sem
          acessar esta plataforma, pode ser necessário repetir o processo para
          renovar o acesso.
        </span>
      </div>

      {admin.isMaster && (
        <div>
          <Button
            type="primary"
            className="register-btn"
            onClick={() => handleIntegration()}
            style={{
              backgroundColor: admin.accessToken ? "red" : "#33cc33",
              height: "4rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ fontSize: "1rem" }}>
              {" "}
              {!admin.accessToken ? "Conectar com" : "Desconectar de"}
            </span>{" "}
            <img
              src={MarketLogo}
              style={{ width: "8rem", marginLeft: "0.5rem" }}
            />
          </Button>
        </div>
      )}
    </div>
  );
};
