import React, { useEffect, useState } from "react";
import { Input, Modal, Select } from "antd";
import { useVehicles } from "../../../contexts/vehicleContext";
import { toast } from "react-toastify";
import { Questions } from "../../../model/questions.model";

const { Option } = Select;

interface IModalQuestions {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  vehicleId: string;
  question: Questions;
}

const QuestionModal: React.FC<IModalQuestions> = ({
  open,
  setOpen,
  question,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const { loadingVehicle, answerQuestion } = useVehicles();

  const handleOk = async () => {
    try {
      if (question.status === "UNANSWERED" && answer !== "-") {
        await answerQuestion(question.questionId, answer);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Erro ao enviar a resposta para a pergunta.");
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Pergunta e Resposta"
      open={open}
      onOk={handleOk}
      confirmLoading={loadingVehicle}
      onCancel={handleCancel}
      okText="Enviar"
      okType="primary"
      cancelText="Cancelar"
      okButtonProps={{ disabled: question.status !== "UNANSWERED" || answer.length < 5 }}
    >
      <div>
        <span style={{ fontSize: "1rem", fontWeight: "600" }}> Pergunta </span>
        <Input.TextArea
          value={question.text}
          style={{ marginTop: "0.5rem" }}
          className="input-vehicle"
          maxLength={200}
          placeholder="Ex: Duas portas / Vem com escada."
          rows={4}
          readOnly
        />
      </div>
      <div>
        <span style={{ fontSize: "1rem", fontWeight: "600" }}> Resposta </span>
        <Input.TextArea
          value={question.status !== "UNANSWERED" ? question.answer : answer}
          style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
          className="input-vehicle"
          maxLength={200}
          placeholder="Insira sua resposta para a determinada pergunta."
          rows={4}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={false}
          readOnly={question.status !== "UNANSWERED"}
        />
      </div>
    </Modal>
  );
};

export default QuestionModal;
