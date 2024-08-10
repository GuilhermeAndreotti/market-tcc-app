import React, { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { useVehicles } from "../../../contexts/vehicleContext";
import { toast } from "react-toastify";

const { Option } = Select;

interface IModalVehicle {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  vehicleId: string;
}

const DeleteAdmin: React.FC<IModalVehicle> = ({
  open,
  setOpen,
  loading,
  vehicleId,
}) => {
  const [deleteOption, setDeleteOption] = useState<string>("all");
  const {
    vehicle,
    loadingVehicle,
    findVehicleById,
    deleteVehicleMercadoLivre,
  } = useVehicles();

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId);
    }
  }, [vehicleId, findVehicleById]);

  const handleOk = async () => {
    try {
      if (vehicle?.publication?.published && vehicle?.publication?.itemId) {
        await deleteVehicleMercadoLivre(vehicle.vehicleId, vehicle?.publication?.itemId, deleteOption);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Erro ao deletar o veículo");
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value: string) => {
    setDeleteOption(value);
  };

  return (
    <Modal
      title="Deletar veículo"
      open={open}
      onOk={handleOk}
      confirmLoading={loadingVehicle}
      onCancel={handleCancel}
      okText="Deletar"
      okType="danger"
      cancelText="Cancelar"
    >
      {!vehicle?.publication?.published ? (
        <p>
          Você tem certeza que deseja deletar este veículo de sua base de dados?
          Esta ação é irreversível :).
        </p>
      ) : (
        <div>
          <p>
            Como você deseja deletar este anúncio? Essa ação é irreversível.
          </p>

          <div
            className="d-flex flex-column"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <Select
              value={deleteOption}
              onChange={handleChange}
              style={{ width: "80%", height: "2rem" }}
            >
              <Option value="all">Excluir veículo e publicação</Option>
              <Option value="publish-only">Excluir somente a publicação</Option>
            </Select>
          </div>
        </div>
      )}
      <p className="d-flex flex-column">
        <b> Resumo: </b>
        <span>
          {" "}
          - {`${vehicle.brand} ${vehicle.model} ${vehicle.vehicleYear}`}{" "}
        </span>
        <span> - {`${vehicle?.publication?.description}`} </span>
        <span>
          {`- ${vehicle.fuelType} / ${vehicle.fuelCapacity} L`}{" "}
        </span>
      </p>
    </Modal>
  );
};

export default DeleteAdmin;
