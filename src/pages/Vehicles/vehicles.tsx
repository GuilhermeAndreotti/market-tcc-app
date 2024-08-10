import {
  ArrowsAltOutlined,
  CarOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../../contexts/vehicleContext";
import MarketLogo from "../../images/mercado-livre.svg";
import { moneyMask } from "../../util/formatCurreny";
import PostOnMercadoLivreModal from "./componentes/modal";
import "./index.css";
import { toast } from "react-toastify";
import { useAdmin } from "../../contexts/adminContext";
import DeleteOnMercadoLivreModal from "./componentes/delete";
import SoldVehicle from "./componentes/sellModal";

export const Vehicles = () => {
  const { getVehicles, vehicles, loadingVehicle } = useVehicles();
  const { admin, getAdminById } = useAdmin();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalSold, setOpenModalSold] = useState<boolean>(false);
  const [selectedVehicleId, setVelectedVehicleId] = useState<string>("");

  const vehiclesPerPage = 5;
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      await getVehicles();
    };
    fetchVehicles();
  }, [openModal]);

  const navigate = useNavigate();

  return (
    <>
      <PostOnMercadoLivreModal
        open={openModal}
        setOpen={setOpenModal}
        loading={loadingVehicle}
        vehicleId={selectedVehicleId}
      />
      <DeleteOnMercadoLivreModal
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        loading={loadingVehicle}
        vehicleId={selectedVehicleId}
      />
      <SoldVehicle
        open={openModalSold}
        setOpen={setOpenModalSold}
        loading={loadingVehicle}
        vehicleId={selectedVehicleId}
      />

      <div className="vehicles-div mb-2">
        <div className="vehicle-content">
          <span className="vehicle-title mb-2">Veículos</span>
        </div>
        <Button
          type="primary"
          className="register-btn mb-2"
          style={{ backgroundColor: "#33cc33" }}
          onClick={() => navigate("/vehicle-register")}
        >
          Cadastrar veículo
        </Button>
      </div>
      <div>
        <div className="vehicle-list">
          {currentVehicles.length === 0 && (
            <div
              className="d-flex flex-column align-items-center"
              style={{
                fontSize: "1.5rem",
                marginTop: "30vh",
                textAlign: "center",
                color: "green",
              }}
            >
              <CarOutlined style={{ width: "2rem" }} />
              <span>Não há veículos cadastrados no momento. </span>
            </div>
          )}
          {currentVehicles.map((vehicle, index) => (
            <Card
              className="card-vehicles"
              style={{ backgroundColor: vehicle.publication?.sold ? '#F9F6EE' : 'white'}}
              cover={
                <img
                  alt={vehicle?.publication?.title ?? "-"}
                  src={vehicle.image1 ?? "-"}
                  className="vehicle-image"
                />
              }
              actions={
                !vehicle.publication?.sold
                  ? [
   
                        <ArrowsAltOutlined
                       
                          key="expand"
                          onClick={() => {
                            navigate(`/detailed-vehicle/${vehicle.vehicleId}`);
                          }}
                        />
                        ,
                        <>
                          {admin.canIntegrate && (
                            <img
                              src={MarketLogo}
                              style={{ width: "3rem" }}
                              onClick={() => {
                                if (admin.canIntegrate) {
                                  setVelectedVehicleId(vehicle.vehicleId);
                                  setOpenModal(true);
                                } else {
                                  toast.error(
                                    "Sem permissão! 😥​ Contate seu administrador para obter ajuda caso isso estiver errado."
                                  );
                                }
                              }}
                            />
                          )}
                        </>
                        ,
                        <CommentOutlined
                          key="comment"
                          onClick={() => {
                            if (admin.canIntegrate) {
                              navigate(
                                `/vehicles-comments/${vehicle.vehicleId}`
                              );
                            } else {
                              toast.error(
                                "Sem permissão! 😥​ Contate seu administrador para obter ajuda caso isso estiver errado."
                              );
                            }
                          }}
                        />
                        ,
                        <DeleteOutlined
                          key="delete"
                          onClick={() => {
                            if (admin.canIntegrate) {
                              setVelectedVehicleId(vehicle.vehicleId);
                              setOpenModalDelete(true);
                            } else {
                              toast.error(
                                "Sem permissão! 😥​ Contate seu administrador para obter ajuda caso isso estiver errado."
                              );
                            }
                          }}
                        />
                        ,
                        <FileDoneOutlined
                          key="done"
                          onClick={() => {
                            if (admin.canIntegrate) {
                              setVelectedVehicleId(vehicle.vehicleId);
                              setOpenModalSold(true);
                            } else {
                              toast.error(
                                "Sem permissão! 😥​ Contate seu administrador para obter ajuda caso isso estiver errado."
                              );
                            }
                          }}
                        />
              
                    ]
                  : []
              }
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
                  {!vehicle.publication?.sold ? (
                    <span>
                      <b>Status:</b>{" "}
                      {vehicle?.publication?.published ? (
                        <span style={{ color: "orange" }}> Publicado ​ </span>
                      ) : (
                        <span style={{ color: "red" }}> ​Não publicado </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      <b>Status:</b>
                      <span style={{ color: "green" }}> Vendido ​ </span>
                    </span>
                  )}
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
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i + 1)}
              className={currentPage === i + 1 ? "active pag-btn" : "pag-btn"}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
