import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";
import { Vehicle } from "../../../model/vehicle.model";
import { useVehicles } from "../../../contexts/vehicleContext";
import { Group } from "antd/es/avatar";
import { UpdateToPublish } from "../../../model/updateAndPublish";
import { toast } from "react-toastify";
import { PublishResponse } from "../../../model/publishResponse";

interface IModalVehicle {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  vehicleId: string;
}

const PostOnMercadoLivreModal: React.FC<IModalVehicle> = ({
  open,
  setOpen,
  loading,
  vehicleId,
}) => {
  const [form] = Form.useForm();
  const [url, setUrl] = useState<string>("-");
  const [btnText, setBtnTxt] = useState<string>("Publicar");
  const { vehicle, findVehicleById, updateVehicle, loadingVehicle, publish, createPublication } =
    useVehicles();

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (vehicle) {
      form.setFieldsValue({
        ...vehicle.publication,
        title:
          vehicle?.publication?.title === "" ||
          vehicle?.publication?.title === undefined ||
          vehicle?.publication?.title === null
            ? `${vehicle.brand} ${vehicle.model} ${vehicle.vehicleYear}`
            : vehicle?.publication?.title ,
        singleOwner: vehicle.singleOwner ?? "false",
        itemCondition: vehicle.itemCondition ?? "Novo",
      });
      if (vehicle?.publication?.published) {
        setBtnTxt("Editar");
      }
    }
  }, [vehicle, form]);

  const handleOk = async () => {
    try {
      await form.submit();
    } catch (error) {
      console.error("Erro ao submeter o formulário:", error);
    }
  };

  const onFinish = async (values: UpdateToPublish) => {
    try {
      let status;
      status = await createPublication(vehicleId, {
        title: values.title,
        price: values.price,
        description: values.description,
        contactSchedule: values.contactSchedule,
        published: Boolean(values.published) ?? vehicle?.publication?.published, 
      });
      if (status.code === 200 && values.published) {
        const resp: PublishResponse = await publish(vehicleId);
        status = resp.status;
      }
      if (status.code === 200) {
        window.location.reload();
        setOpen(false);

      }
      if (status === 201) {
        setUrl(status.url);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Publicar Mercado Livre"
        open={open}
        onOk={handleOk}
        confirmLoading={loadingVehicle}
        onCancel={handleCancel}
        okText={btnText}
        cancelText="Cancelar"
      >
        {!vehicle?.publication?.published && (
          <p>
            Este veículo ainda não fui publicado no Mercado Livre! Para publicar
            preencha os campos abaixo.
          </p>
        )}
        {vehicle?.publication?.published && (
          <p>Este veículo está publicado no Mercado Livre!</p>
        )}
        <div className="w-100">
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="w-100 mt-2"
            >
              <div className="d-flex" style={{ gap: "20px" }}>
                <Form.Item
                  name="title"
                  className="post-form w-50"
                  label="Insira o título de apresentação."
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    className="input-vehicle"
                    maxLength={60}
                    placeholder="Ex: Fiat Uno 4 portas."
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  className="post-form w-50"
                  label="Insira o preço."
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    type="number"
                    className="input-vehicle"
                    maxLength={7}
                    placeholder="Ex: 200200."
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="contactSchedule"
                className="post-form"
                label="Mensagem para horário de conversa: "
                rules={[{ required: true, message: "" }]}
              >
                <Input
                  className="input-vehicle"
                  maxLength={50}
                  placeholder="Ex: Entre em contato depois das 13h: (18) 981239941"
                />
              </Form.Item>
              <Form.Item
                name="description"
                className="post-form"
                label="Insira a descrição."
                rules={[{ required: true, message: "" }]}
              >
                <Input.TextArea
                  className="input-vehicle"
                  maxLength={200}
                  placeholder="Ex: Duas portas / Vem com escada."
                  rows={4}
                />
              </Form.Item>

              {!vehicle.publication?.published && (
                <Form.Item
                  label="Deseja publicar agora? Se escolher (Não), o sistema irá apenas salvar as configurações"
                  name="published"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, escolha uma opção.",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={true}>Sim</Radio>
                    <Radio value={false}>Não</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Form>
            {vehicle?.publication?.permalink && vehicle?.publication?.published && (
              <div>
                <p>
                  Link do anúncio:{" "}
                  <a href={vehicle?.publication?.permalink}> {vehicle?.publication?.permalink} </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PostOnMercadoLivreModal;
