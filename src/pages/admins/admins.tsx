import { Button, Table, TableColumnsType } from "antd";
import { useAdmin } from "../../contexts/adminContext";
import { Admin } from "../../model/admin.model";
import { useCallback, useEffect, useState } from "react";
import AdminModal from "./componentes/modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteAdmin from "./componentes/delete";
import DeleteAdminModal from "./componentes/deleteAdmin";

export const AdminScreen = () => {
  const { admins, getAdmins, loadingAdmin } = useAdmin();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [adminToEdit, setAdminToEdit] = useState<Admin>(Object.assign({}));

  useEffect(() => {
    const fetchUsers = async () => {
      await getAdmins();
    };
    fetchUsers();
  }, [openModal]);

  const columns: TableColumnsType<Admin> = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "Telefone", dataIndex: "phone", key: "phone" },
    {
      title:
        "Este usuário pode realizar as funcionalidades do Mercado Livre (publicar, editar, excluir)?",
      dataIndex: "",
      key: "x",
      render: (adm: Admin) => (
        <div style={{ fontWeight: "600" }}>
          {adm.canIntegrate
            ? "Pode utilizar a integração com o Mercado Livre"
            : "Sem permissão para utilizar o Mercado Livre"}
        </div>
      ),
    },
    {
      title: "Ações",
      dataIndex: "",
      key: "x",
      render: (adm: Admin) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          <Button
            type="primary"
            className="register-btn mb-2"
            disabled={
              localStorage.getItem("adminId") !== process.env.REACT_APP_ADMIN_ID
            }
            style={{ backgroundColor: "#33cc33" }}
            onClick={() => {
              handleClick(adm);
            }}
          >
            <EditOutlined style={{ fontSize: "1.5rem" }} /> Editar
          </Button>
          <Button
            type="primary"
            className="register-btn mb-2"
            disabled={
              localStorage.getItem("adminId") !== process.env.REACT_APP_ADMIN_ID
            }
            style={{ backgroundColor: "red" }}
            onClick={() => {
              handleClickDelete(adm);
            }}
          >
            <DeleteOutlined style={{ fontSize: "1.5rem" }} />
          </Button>
        </div>
      ),
    },
  ];

  const handleClick = useCallback(
    (adm: Admin) => {
      setAdminToEdit(adm);
      setOpenEditModal(true);
    },
    [openEditModal]
  );

  const handleClickDelete = useCallback(
    (adm: Admin) => {
      setAdminToEdit(adm);
      setOpenDeleteModal(true);
    },
    [openDeleteModal]
  );

  return (
    <div>
      <AdminModal
        open={openModal}
        setOpen={setOpenModal}
        loading={loadingAdmin}
        edit={false}
      />
      <AdminModal
        adminToEdit={adminToEdit}
        open={openEditModal}
        setOpen={setOpenEditModal}
        loading={loadingAdmin}
        edit={true}
      />
      <DeleteAdminModal
        adminId={adminToEdit.adminId}
        loading={loadingAdmin}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
      <div className="vehicles-div mb-2">
        <div className="vehicle-content">
          <span className="vehicle-title mb-2">Administradores</span>
        </div>
        {localStorage.getItem("adminId") === process.env.REACT_APP_ADMIN_ID && (
          <Button
            type="primary"
            className="register-btn mb-2"
            style={{ backgroundColor: "#33cc33" }}
            onClick={() => setOpenModal(true)}
          >
            Cadastrar administrador
          </Button>
        )}
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Table
          style={{ width: "90%" }}
          columns={columns}
          pagination={{ pageSize: 5 }}
          expandable={{
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={admins ?? []}
        />
      </div>
    </div>
  );
};
