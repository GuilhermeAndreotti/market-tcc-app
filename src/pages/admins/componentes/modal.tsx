import { Form, Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../contexts/adminContext";
import { Admin } from "../../../model/admin.model";

interface IModalAdmin {
  open: boolean;
  edit: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  adminToEdit?: Admin;
}

const AdminModal: React.FC<IModalAdmin> = ({
  open,
  edit,
  setOpen,
  loading,
  adminToEdit,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loadingAdmin, saveAdmin, editAdmin } = useAdmin();
  const [btnText, setBtnTxt] = useState<string>("Cadastrar");
  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    form.setFieldsValue(undefined);
  }, []);

  useEffect(() => {
    if (open && !edit) {
      form.resetFields();
    }
  }, [open, form]);

  useEffect(() => {
    if (edit) {
      form.setFieldsValue({
        ...adminToEdit,
      });
      if (adminToEdit) {
        setBtnTxt("Editar");
      }
    }
  }, [adminToEdit, form]);

  const handleOk = async () => {
    try {
      await form.submit();
    } catch (error) {
      console.error("Erro ao submeter o formulário:", error);
    }
  };

  const onFinish = async (values: Admin) => {
    try {
      if(!edit){
        await saveAdmin(values);
      } else {
        await editAdmin(values);
      }
      window.location.reload();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao processar os valores do formulário:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Administradores"
        open={open}
        onOk={handleOk}
        confirmLoading={loadingAdmin}
        onCancel={handleCancel}
        okText={btnText}
        cancelText="Fechar"
      >
        <p>
          {edit ? "Edite" : "Preencha"} os
          campos necessários para {edit ? "do " : "o cadastro do"}{" "}
          administrador.
        </p>
        <div className="w-100">
          <p>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="w-100 mt-2"
            >
              <div className="d-flex" style={{ gap: "20px" }}>
                {!edit && (
                  <Form.Item
                    name="login"
                    className="post-form w-100"
                    label="Insira o e-mail de login do usuário."
                    rules={[
                      { required: true, message: "O login é obrigatório." },
                      {
                        type: "email",
                        message:
                          "Por favor, insira um endereço de email válido!",
                      },
                    ]}
                  >
                    <Input
                      className="input-vehicle"
                      maxLength={50}
                      placeholder="Ex: login"
                    />
                  </Form.Item>
                )}
              </div>
              <p className="d-flex justify-content-center text-center">
                {!edit &&<b>
                  Lembre-se de informar o login e senha para o administrador que
                  for utilizar esta conta.
                </b>}
              </p>
              <div className="d-flex" style={{ gap: "20px" }}>
                <Form.Item
                  name="name"
                  className="post-form w-50"
                  label="Insira o nome do usuário."
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    className="input-vehicle"
                    maxLength={80}
                    placeholder="Ex: Carlos, Jorge, Abigail..."
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  className="post-form w-50"
                  label="Insira o contato"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    type="phone"
                    className="input-vehicle"
                    maxLength={20}
                    placeholder="Ex: (18) 981239941"
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Este administrador poderá realizar as seguintes ações com o Mercado Livre: publicar, editar anúncios, excluir, visualizar e perguntar/responder."
                name="canIntegrate"
                rules={[
                  { required: true, message: "Por favor, escolha uma opção." },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Sim</Radio>
                  <Radio value={false}>Não</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default AdminModal;
