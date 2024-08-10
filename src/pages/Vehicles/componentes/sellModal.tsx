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

const SoldVehicle: React.FC<IModalVehicle> = ({
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
    soldVehicle,
  } = useVehicles();

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId);
    }
  }, [vehicleId, findVehicleById]);

  const handleOk = async () => {
    try {
      if (vehicle.publication?.published && vehicle.publication?.itemId) {
        await soldVehicle(
          vehicle.vehicleId,
        );
        setOpen(false);
      }
    } catch (error) {
      toast.error("Erro ao salvar o veículo");
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
      title="Vender veículo"
      open={open}
      onOk={handleOk}
      confirmLoading={loadingVehicle}
      onCancel={handleCancel}
      okText="Sim, desejo!"
      okType="primary"
      cancelText="Cancelar"
    >
      <p>
        Você tem certeza que deseja marcar este veículo como vendido? Esta ação
        irá encerrar o anúncio no Mercado Livre e marcar no sistema como
        vendido.
      </p>

      <p className="d-flex flex-column">
        <b> Resumo: </b>
        <span>
          {" "}
          - {`${vehicle.brand} ${vehicle.model} ${vehicle.vehicleYear}`}{" "}
        </span>
        <span> - {`${vehicle.publication?.description}`} </span>
        <span>{`- ${vehicle.fuelType} / ${vehicle.fuelCapacity} L`} </span>
      </p>
    </Modal>
  );
};

export default SoldVehicle;
