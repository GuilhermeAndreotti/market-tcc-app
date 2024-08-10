import { SetStateAction, useEffect, useState } from "react";
import { useAdmin } from "../../contexts/adminContext";
import "./index.css";
import { Button, Card, Table, TableColumnsType } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import MarketLogo from "../../images/mercado-livre.svg";
import RegisterLogo from "../../images/car-vector.png";
import { useVehicles } from "../../contexts/vehicleContext";
import { moneyMask } from "../../util/formatCurreny";
import { Questions } from "../../model/questions.model";
import { translateStatus } from "../../util/fieldsUtil";
import QuestionModal from "./componentes/modalAnswer";

export const Comments = () => {
  const { admin, loadingAdmin } = useAdmin();
  const { findVehicleById, loadingVehicle, vehicle, checkVehicles, questions } =
    useVehicles();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [question, setQuestion] = useState<Questions>(Object.assign({}));
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicleId) {
      checkVehicles(vehicleId);
    }
  }, [vehicleId]);

  const columns: TableColumnsType<Questions> = [
    { title: "ID", dataIndex: "questionId", key: "questionId" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div
          className="d-flex justify-content-center align-items-center w-100"
          style={{
            minWidth: "5rem",
            fontWeight: "600",
            borderRadius: "8px",
            height: "2rem",
            color: status === "UNANSWERED" ? "black" : "white",
            backgroundColor: status === "UNANSWERED" ? "yellow" : "green",
          }}
        >
          {translateStatus(status)}
        </div>
      ),
    },
    { title: "Pergunta", dataIndex: "text", key: "text" },
    {
      title: "Ações",
      dataIndex: "",
      key: "x",
      render: (question) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          <Button
            type="primary"
            className="register-btn mb-2"
            style={{
              color: question.status === "UNANSWERED" ? "black" : "white",
              backgroundColor:
                question.status === "UNANSWERED" ? "yellow" : "green",
            }}
            disabled={
              localStorage.getItem("adminId") !== process.env.REACT_APP_ADMIN_ID
            }
            onClick={() => {
              setQuestion(question);
              setOpenModal(true);
            }}
          >
            {question.status === "UNANSWERED" ? "Responder" : "Ver resposta"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <QuestionModal
        open={openModal}
        setOpen={setOpenModal}
        loading={loadingVehicle}
        question={question}
        vehicleId={vehicle.vehicleId}
      />
      <div className="vehicles-div mb-2">
        <div className="vehicle-content">
          <span className="vehicle-title mb-2"> Perguntas e Respostas </span>
        </div>
      </div>
      <div className="d-flex" style={{ gap: "40px" }}>
        <div>
          <div style={{ padding: "22px", paddingBottom: "1px" }}>
            <span className="vehicle-sub-title" style={{ fontWeight: "700" }}>
              Veículo escolhido:
            </span>
          </div>

          <Card
            className="card-vehicles"
            style={{ minWidth: "20rem" }}
            cover={
              <img
                alt={vehicle?.publication?.title ?? "-"}
                src={vehicle.image1 ?? "-"}
                className="vehicle-image"
              />
            }
            actions={[
              <Button
                type="primary"
                className="register-btn"
                style={{ backgroundColor: "#33cc33", width: "80%" }}
                onClick={() => navigate(`/detailed-vehicle/${vehicleId}`)}
              >
                Navegar até edição
              </Button>,
            ]}
          >
            <div className="d-flex flex-column sizing-modal">
              <span className="vehicle-title-card">
                {`${vehicle.brand} ${vehicle.model} ${vehicle.vehicleYear} ${
                  vehicle.itemCondition ?? ""
                } ${vehicle.kilometers + " km"}`}
              </span>
              <div className="d-flex flex-column vehicle-subtitle-card mt-2">
                <span>
                  <b>Valor:</b>
                  {vehicle?.publication?.price
                    ? moneyMask(vehicle?.publication?.price)
                    : "Valor ainda não informado."}
                </span>
                <span>
                  <b>Status:</b>{" "}
                  {vehicle?.publication?.published ? (
                    <span style={{ color: "green" }}> Publicado ​ </span>
                  ) : (
                    <span style={{ color: "red" }}> ​Não publicado </span>
                  )}
                </span>
                <span>
                  <b>Anúncio:</b>{" "}
                  <span style={{ color: "green" }}>
                    <a href={vehicle?.publication?.permalink ?? '...'}>
                      {vehicle?.publication?.permalink ?? '...'}{" "}
                    </a>
                    ​{" "}
                  </span>
                </span>
                <span>
                  <b>Combustível:</b>
                  {` ${vehicle.fuelType} com ${vehicle.fuelCapacity}`}{" "}
                </span>
                <span>
                  <b>Direção:</b>
                  {` ${vehicle.steering}`}{" "}
                </span>
                <span>
                  {" "}
                  <b>Descrição:</b>{" "}
                  {vehicle?.publication?.title
                    ? ` ${vehicle?.publication?.title} ${
                        vehicle?.publication?.description
                          ? ": " + vehicle?.publication?.description
                          : ""
                      }`
                    : "Descrição ainda não foi informada."}{" "}
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ padding: "22px", paddingBottom: "1px", width: "100%" }}>
          <span className="vehicle-sub-title" style={{ fontWeight: "700" }}>
            Perguntas:
          </span>
          <div className="d-flex justify-content-center mt-5 w-100">
            <Table
              style={{ width: "90%" }}
              columns={columns}
              pagination={{ pageSize: 5 }}
              dataSource={questions ?? []}
            />
          </div>
        </div>
      </div>
    </>
  );
};
