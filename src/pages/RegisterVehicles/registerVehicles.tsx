import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Select,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVehicles } from "../../contexts/vehicleContext";
import { Vehicle } from "../../model/vehicle.model";
import {
  FileType,
  checkYear,
  getBase64,
  handleUploadImages,
  removeImageOnRemoveEdit,
  validatePassengerCapacity,
  validatePositiveNumber,
} from "../../util/fieldsUtil";
import { toast } from "react-toastify";
import "./index.css";

interface IVehicle {
  edit: boolean;
}

const RegisterVehicles = ({ edit }: IVehicle) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  let [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const {
    saveVehicle,
    handleImageUpload,
    findVehicleById,
    vehicle,
    loadingVehicle,
    updateVehicle,
    updateVehicleMercadoLivre,
    deleteImages,
  } = useVehicles();
  const { vehicleId } = useParams();

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    if (edit) {
      removeImageOnRemoveEdit(fileList, vehicle, newFileList);
    }
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}> Adicionar </div>
    </button>
  );

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (!loadingVehicle && vehicle && edit) {
      const transformedVehicle = Object.entries(vehicle).reduce(
        (acc: any, [key, value]) => {
          if (value === "true" || value === "false") {
            acc[key] = value === "true";
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      form.setFieldsValue({
        ...transformedVehicle,
        singleOwner: String(vehicle.singleOwner) ?? "false",
      });

      const newFileList: any = [];
      for (let i = 1; i <= 4; i++) {
        const imageUrl = transformedVehicle[`image${i}`];
        if (imageUrl) {
          newFileList.push({
            uid: `${i}`,
            name: `image${i}.png`,
            status: "done",
            url: imageUrl,
          });
        }
      }
      setFileList(newFileList);
    }
  }, [loadingVehicle, vehicle, form, edit]);


  const onFinish = async (values: Vehicle) => {
    setLoading(true);
    if (fileList.length > 1) {
      try {
        let updatedValues: Vehicle = { ...values };

        updatedValues = await handleUploadImages(
          edit,
          values,
          vehicle,
          fileList,
          handleImageUpload,
          updatedValues
        );

        if (edit && vehicleId) {
          await updateVehicle(vehicleId, updatedValues);
          if(vehicle?.publication?.published && vehicle?.publication?.itemId){
            await updateVehicleMercadoLivre(vehicleId);
          }
          navigate("/vehicles");
        } else {
          await saveVehicle(updatedValues);
          navigate("/vehicles");
        }
      } catch (error) {
        toast.warn("Houve um erro ao cadastrar as imagens.​");
      }
    } else {
      toast.warn("Por favor, insira duas (2) imagens no mínimo. 🚗​🚘​");
    }
    setLoading(false);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="vehicle-form mt-4"
      >
        <span className="vehicle-sub-title title-underline mb-2">
          Imagens do veículo
        </span>

        <div className="d-flex flex-column vehicle-form-line mt-4">
          <span>Insira as imagens do veículo</span>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>

        <span className="vehicle-sub-title title-underline mb-2">
          Informações do veículo
        </span>
        <div className="vehicle-form-line mt-4">
          <Form.Item
            name="brand"
            className="form-question"
            label="Insira a marca do veículo."
            rules={[{ required: true, message: "Insira o título do veículo." }]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              placeholder="Ex: Chevrolet, Fiat"
            />
          </Form.Item>
          <Form.Item
            name="model"
            className="form-question"
            label="Insira o modelo do veículo."
            rules={[{ required: true, message: "Insira o modelo do veículo." }]}
          >
            <Input
              className="input-vehicle"
              maxLength={30}
              placeholder="Ex: Onix, Uno"
            />
          </Form.Item>
          <Form.Item
            name="vehicleYear"
            className="form-question"
            label="Insira o ano do veículo"
            rules={[{ validator: checkYear }]}
          >
            <Input
              className="input-vehicle"
              type="number"
              placeholder={`Ex: 1998-2021`}
            />
          </Form.Item>
        </div>
        <div className="vehicle-form-line">
          <Form.Item
            name="height"
            className="form-question"
            label="Altura do veículo (mm)"
            rules={[
              { required: true, message: "Insira a altura" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={10}
              type="number"
              placeholder="Ex: 1500 mm."
            />
          </Form.Item>
          <Form.Item
            className="form-question"
            name="width"
            label="Largura do veículo (mm)"
            hasFeedback
            rules={[
              { required: true, message: "Insira a largura" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={10}
              type="number"
              placeholder="Ex: 1800 mm."
            />
          </Form.Item>
          <Form.Item
            name="length"
            className="form-question"
            label="Comprimento (mm)"
            rules={[
              { required: true, message: "Insira o comprimento" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              type="number"
              placeholder="Ex: 4500 mm."
            />
          </Form.Item>
        </div>
        <div className="vehicle-form-line">
          <Form.Item
            name="licensePlate"
            className="form-question"
            label="Placa do Veículo"
            rules={[{ required: true, message: "Insira a placa do veículo." }]}
          >
            <Input
              className="input-vehicle"
              maxLength={7}
              placeholder="Ex: ABC1234."
            />
          </Form.Item>
          <Form.Item
            className="form-question"
            name="doorQuantity"
            label="Quantidade de portas"
            hasFeedback
            rules={[
              { required: true, message: "Selecione a quantidade de portas." },
            ]}
          >
            <Select className="input-vehicle" placeholder="Ex: 2">
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="color"
            className="form-question"
            label="Cor do veículo"
            rules={[{ required: true, message: "Insira a cor do veículo." }]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              placeholder="Ex: Preto, Vermelho."
            />
          </Form.Item>
        </div>
        <div className="vehicle-form-line">
          <Form.Item
            name="distanceBetweenAxes"
            className="form-question"
            label="Distância entre eixos (mm)"
            rules={[
              { required: true, message: "Insira a distância entre os eixos" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              type="number"
              placeholder="Ex: 2600 mm"
            />
          </Form.Item>
          <Form.Item
            name="valvesPerCylinder"
            className="form-question"
            label="Válvulas por cilindro"
            rules={[
              { required: true, message: "Insira a valvula por cilindro" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              type="number"
              placeholder="Ex: 4, 5, 6"
            />
          </Form.Item>
          <Form.Item
            name="gearNumber"
            className="form-question"
            label="Engrenagem"
            rules={[
              { required: true, message: "Insira o valor da engrenagem" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={20}
              type="number"
              placeholder="Ex: 4, 5, 6"
            />
          </Form.Item>
        </div>
        <div className="vehicle-form-line">
          <Form.Item
            name="vehicleBodyType"
            className="form-question"
            label="Tipo de carroceria"
            rules={[{ required: true, message: "Insira o tipo de carroçaria" }]}
          >
            <Select className="input-vehicle" placeholder="Ex: 4x2">
              <Select.Option value="Conversível">Conversível</Select.Option>
              <Select.Option value="Coupé">Coupé</Select.Option>
              <Select.Option value="Furgão">Furgão</Select.Option>
              <Select.Option value="Monovolume">Monovolume</Select.Option>
              <Select.Option value="Minivan">Minivan</Select.Option>
              <Select.Option value="Off-Road">Off-Road</Select.Option>
              <Select.Option value="Van">Van</Select.Option>
              <Select.Option value="Perua">Perua</Select.Option>
              <Select.Option value="Hatch">Hatch</Select.Option>
              <Select.Option value="Sedã">Sedã</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="form-question"
            name="itemCondition"
            label="Condição:"
            hasFeedback
            rules={[{ required: true, message: "" }]}
          >
            <Select className="input-vehicle" placeholder="Ex: Usado">
              <Select.Option value="Novo">Novo</Select.Option>
              <Select.Option value="Usado">Usado</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="form-question"
            name="singleOwner"
            label="Só um proprietário?"
            hasFeedback
            rules={[{ required: true, message: "" }]}
          >
            <Select className="input-vehicle" placeholder="Ex: Sim">
              <Select.Option value="true">Sim</Select.Option>
              <Select.Option value="false">Não</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <span className="vehicle-sub-title title-underline mb-4">
          Combustível
        </span>
        <div className="vehicle-form-line">
          <Form.Item
            name="fuelType"
            className="form-question"
            label="Tipo de combustível"
            rules={[
              { required: true, message: "Insira o tipo de combustível." },
            ]}
          >
            <Select className="input-vehicle" placeholder="Ex: Gasolina">
              <Select.Option value="Gasolina e elétrico">
                Gasolina e elétrico
              </Select.Option>
              <Select.Option value="Tetra-combustible">
                Tetra-combustible
              </Select.Option>
              <Select.Option value="Diesel">Diesel</Select.Option>
              <Select.Option value="Elétrico">Elétrico</Select.Option>
              <Select.Option value="Gasolina">Gasolina</Select.Option>
              <Select.Option value="Gasolina e álcool">
                Gasolina e álcool
              </Select.Option>
              <Select.Option value="Álcool">Álcool</Select.Option>
              <Select.Option value="Híbrido/Gasolina">
                Híbrido/Gasolina
              </Select.Option>
              <Select.Option value="Álcool e gás natural">
                Álcool e gás natural
              </Select.Option>
              <Select.Option value="Etanol">Etanol</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fuelCapacity"
            className="form-question"
            label="Quantidade máxima de combustível em L"
            rules={[
              { required: true, message: "Insira a quantidade máxima" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={3}
              type="number"
              placeholder="Ex: 50, 60, 100."
            />
          </Form.Item>
          <Form.Item
            name="kilometers"
            className="form-question"
            label="Insira os quilômetros (km)"
            rules={[
              { required: true, message: "Insira os km" },
              { validator: validatePositiveNumber },
            ]}
          >
            <Input
              className="input-vehicle"
              type="number"
              placeholder={`Ex: 8000`}
            />
          </Form.Item>
        </div>
        <span className="vehicle-sub-title title-underline mb-4">
          Direção e Visual
        </span>
        <div className="vehicle-form-line">
          <Form.Item
            name="steering"
            className="form-question"
            label="Direção"
            rules={[
              { required: true, message: "Insira a direção do veículo." },
            ]}
          >
            <Select className="input-vehicle" placeholder="Ex: Elétrica">
              <Select.Option value="Elétrica">Elétrica</Select.Option>
              <Select.Option value="Mecânica">Mecânica</Select.Option>
              <Select.Option value="Hidráulica">Hidráulica</Select.Option>
              <Select.Option value="Assistida">Assistida</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="transmission"
            className="form-question"
            label="Tipo de transmissão"
            rules={[
              { required: true, message: "Insira o tipo de transmissão." },
            ]}
          >
            <Select className="input-vehicle" placeholder="Ex: Manual">
              <Select.Option value="Automática">Automática</Select.Option>
              <Select.Option value="Manual">Manual</Select.Option>
              <Select.Option value="Automática sequencial">
                Automática sequencial
              </Select.Option>
              <Select.Option value="Semiautomática">
                Semiautomática
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="tractionControl"
            className="form-question"
            label="Controle de tração"
            rules={[
              { required: true, message: "Insira o controle de tração." },
            ]}
          >
            <Select className="input-vehicle" placeholder="Ex: Dianteira">
              <Select.Option value="6x2">6x2</Select.Option>
              <Select.Option value="6x4">6x4</Select.Option>
              <Select.Option value="6x6">6x6</Select.Option>
              <Select.Option value="Dianteira">Dianteira</Select.Option>
              <Select.Option value="Traseira">Traseira</Select.Option>
              <Select.Option value="Integral">Integral</Select.Option>
              <Select.Option value="4x2">4x2</Select.Option>
              <Select.Option value="4x4">4x4</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="vehicle-form-line">
          <Form.Item
            name="trim"
            className="form-question"
            label="Nível de acabamento do veículo"
            rules={[
              {
                required: true,
                message: "Insira o nível de acabamento do veículo.",
              },
            ]}
          >
            <Input
              className="input-vehicle"
              maxLength={15}
              placeholder="Ex: Padrão"
            />
          </Form.Item>
          <Form.Item
            name="passengerCapacity"
            className="form-question"
            label="Quantidade de passageiros."
            rules={[{ validator: validatePassengerCapacity }]}
          >
            <Input
              className="input-vehicle"
              maxLength={15}
              placeholder="Ex: 4, 5, 6..."
            />
          </Form.Item>
        </div>

        <span className="vehicle-sub-title title-underline mb-3">
          Informações adicionais
        </span>
        <div className="d-flex">
          <Form.Item
            name="armored"
            className="form-question-switch"
            label="Proteção?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAbsBrakes"
            className="form-question-switch"
            label="Freio de mão ABS?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAirConditioning"
            className="form-question-switch"
            label="Ar-condicionado?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAlarm"
            className="form-question-switch"
            label="Alarme?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAlloyWheels"
            className="form-question-switch"
            label="Roda de alumínio?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAmfmRadio"
            className="form-question-switch"
            label="Rádio AMFM?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasUsb"
            className="form-question-switch"
            label="USB?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAuxiliaryPort"
            className="form-question-switch"
            label="Entrada adicional?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </div>
        <div className="d-flex">
          <Form.Item
            name="hasWindscreenWiper"
            className="form-question-switch"
            label="Limpador de Para-brisa?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasSteeringWheelControl"
            className="form-question-switch"
            label="Controle no volante?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasPowerDoorLocks"
            className="form-question-switch"
            label="Trava elétrica das portas?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasPowerWindows"
            className="form-question-switch"
            label="Janelas abrem por botão?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasRainSensor"
            className="form-question-switch"
            label="Sensor de chuva?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasHeightAdjustableDriverSeat"
            className="form-question-switch"
            label="Assento com ajuste de altura?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasRearFoglights"
            className="form-question-switch"
            label="Luzes de neblina traseiras?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasSlidingRoof"
            className="form-question-switch"
            label="Teto solar deslizante?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </div>
        <div className="d-flex">
          <Form.Item
            name="hasLeatherUpholstery"
            className="form-question-switch"
            label="Revestimento em couro?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasLightOnReminder"
            className="form-question-switch"
            label="Lembrete de luz ligada?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasMp3Player"
            className="form-question-switch"
            label="MP3?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasOnboardComputer"
            className="form-question-switch"
            label="Computador de bordo?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasParkingSensor"
            className="form-question-switch"
            label="Sensor de estacionamento?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasPassengerAirbag"
            className="form-question-switch"
            label="Airbag?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasCurtainAirbag"
            className="form-question-switch"
            label="Airbag de cortina?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasFogLight"
            className="form-question-switch"
            label="Luz de neblina?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </div>
        <div className="d-flex">
          <Form.Item
            name="hasRearFoldingSeat"
            className="form-question-switch-few"
            label="Banco Traseiro Rebatível?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasElectricMirrors"
            className="form-question-switch-few"
            label="Retrovisores elétricos?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="hasAutopilot"
            className="form-question-switch-few"
            label="Piloto automático?"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </div>

        <Form.Item className="d-flex align-items-start">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || loadingVehicle}
            style={{ height: "3rem", width: "6rem" }}
          >
            {edit ? "Editar" : "Cadastrar"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterVehicles;
