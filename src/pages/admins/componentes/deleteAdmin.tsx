import { Modal } from "antd";
import React from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../../contexts/adminContext";

interface IModalDeleteAdmin {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  adminId: string;
}

const DeleteAdminModal: React.FC<IModalDeleteAdmin> = ({
  open,
  setOpen,
  loading,
  adminId,
}) => {

  const { admin, loadingAdmin, deleteAdmin } = useAdmin();

  const handleDelete = async () => {
    try {
      if (adminId) {
        await deleteAdmin(adminId);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Erro ao deletar o admin");
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Deletar administrador"
      open={open}
      onOk={handleDelete}
      confirmLoading={loadingAdmin}
      onCancel={handleCancel}
      okText="Deletar"
      okType="danger"
      cancelText="Cancelar"
    >
   
        <p>
          Você tem certeza que deseja deletar este administrador de sua base de dados?
          Esta ação é irreversível.
        </p>

    </Modal>
  );
};

export default DeleteAdminModal;
