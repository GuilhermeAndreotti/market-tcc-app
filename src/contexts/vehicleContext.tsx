import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { UploadVehicle } from "../model/upload-vehicle.model";
import { Vehicle } from "../model/vehicle.model";
import { VehicleService } from "../services/vehicles.service";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "../firebase";
import { UpdateVehicle } from "../model/update-vehicle.model";
import { PublishResponse } from "../model/publishResponse";
import { Questions } from "../model/questions.model";

interface IVehicleContext {
  getVehicles: () => Promise<void>;
  vehicles: Vehicle[];
  vehicle: Vehicle;
  loadingVehicle: boolean;
  saveVehicle: (vehicleBody: Vehicle) => Promise<any>;
  handleImageUpload: (file: File) => any;
  deleteImages: (imageUrlsToDelete: string[]) => Promise<void>;
  findVehicleById: (vehicleId: string) => Promise<any>;
  setVehicle: any;
  updateVehicle: (vehicleId: string, updateDto: UpdateVehicle) => Promise<any>;
  publish: (vehicleId: string) => Promise<any>;
  updateVehicleMercadoLivre: (vehicleId: string) => Promise<any>;
  deleteVehicleMercadoLivre: (
    vehicleId: string,
    itemId: string,
    deleteType: string
  ) => Promise<any>;
  checkVehicles: (vehicleId: string) => Promise<any>;
  questions: Questions[];
  answerQuestion: (questionId: string, answer: string) => Promise<any>;
  createPublication: (vehicleId: string, updateDto: UpdateVehicle) => Promise<any>;
  loadingAnswer: boolean;
  soldVehicle: (vehicleId: string) => Promise<void>;
}

const VehicleContext = createContext<IVehicleContext>(Object.assign({}));

const VehicleProvider = ({ children }: any) => {
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>(Object.assign({}));
  const [questions, setQuestions] = useState<Questions[]>([]);

  const vehicleService = useMemo(() => new VehicleService(), []);

  const getVehicles = useCallback(async () => {
    try {
      setLoadingVehicle(true);

      const response = await vehicleService.get();
      setVehicles(response.data ?? []);
    } catch (error) {
      toast.error("Erro ao listar", {
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoadingVehicle(false);
    }
  }, [vehicles, loadingVehicle]);

  const findVehicleById = useCallback(
    async (vehicleId: string) => {
      setLoadingVehicle(true);

      try {
        const res = await vehicleService.getById(vehicleId);
        setVehicle(res.data);
        return res.data;
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingVehicle(false);
      }
    },
    [vehicleService]
  );

  const handleImageUpload = async (file: any): Promise<string | null> => {
    setLoadingVehicle(true);
    try {
      const storageRef = ref(storage, `images/${uuid()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file.originFileObj, {
        contentType: "image/png",
      });

      const imageUrl = await getDownloadURL(snapshot.ref);
      setLoadingVehicle(false);
      return imageUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  };

  const deleteImages = async (imageUrlsToDelete: string[]): Promise<void> => {
    setLoadingVehicle(true);
    try {
      if (imageUrlsToDelete && imageUrlsToDelete.length > 0) {
        await Promise.all(
          imageUrlsToDelete.map(async (imageUrl: string) => {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          })
        );
      }
    } catch (error) {
      console.error("Erro ao deletar as imagens:", error);
    }
  };

  const saveVehicle = useCallback(async (vehicleBody: Vehicle) => {
    setLoadingVehicle(true);

    await vehicleService
      .createVehicle(vehicleBody)
      .then(() => {
        toast.success("Veículo salvo com sucesso​ .", {
          autoClose: 3000,
          theme: "colored",
        });
      })
      .catch(() => {
        toast.error("Erro ao salvar o veículo.", {
          autoClose: 3000,
          theme: "colored",
        });
      })
      .finally(() => setLoadingVehicle(true));
  }, []);

  const updateVehicle = useCallback(
    async (vehicleId: string, updateDto: UpdateVehicle) => {
      setLoadingVehicle(true);
      try {
        const res = await vehicleService.updateVehicle(vehicleId, updateDto);
        toast.success("Veículo editado com sucesso 🚗​🚗​​!");
        return res.data;
      } catch (err) {
        toast.error(
          "Veículo não editado. Verifique os dados e tente novamente."
        );
        return null;
      } finally {
        setLoadingVehicle(false);
      }
    },
    []
  );

  const createPublication = useCallback(
    async (vehicleId: string, updateDto: UpdateVehicle) => {
      setLoadingVehicle(true);
      try {
        const res = await vehicleService.updatePublication(vehicleId, updateDto);
        toast.success("Publicação pré-salva com sucesso 🚗​🚗​​!");
        return res.data;
      } catch (err) {
        toast.error(
          "Veículo não publicado. Verifique os dados e tente novamente."
        );
        return null;
      } finally {
        setLoadingVehicle(false);
      }
    },
    []
  );

  const updateVehicleMercadoLivre = useCallback(async (vehicleId: string) => {
    setLoadingVehicle(true);
    try {
      const res = await vehicleService.updateVehicleMercadoLivre(vehicleId);
      toast.success("Seu anúncio foi editado 🚗​🚗​​!");
      return res.data;
    } catch (err) {
      toast.error("Falha ao editar o anúncio. Verifique se ele ainda existe.");
      console.log(err);
      return null;
    } finally {
      setLoadingVehicle(false);
    }
  }, []);

  const deleteVehicleMercadoLivre = useCallback(
    async (vehicleId: string, itemId: string, deleteType: string) => {
      setLoadingVehicle(true);
      try {
        const res = await vehicleService.deleteVehicleMercadoLivre(
          vehicleId,
          itemId,
          deleteType
        );
        toast.success("Seu anúncio foi deletado 🚗​🚗​​!");
        return res.data;
      } catch (err) {
        toast.error("Houve um problema ao deletar o anúncio.");
        console.log(err);
        return null;
      } finally {
        setLoadingVehicle(false);
      }
    },
    []
  );

  const soldVehicle = useCallback(
    async (vehicleId: string) => {
      setLoadingVehicle(true);
      try {
        const res = await vehicleService.soldVehicle(
          vehicleId,
        );
        toast.success("Parabéns 🚗​🚗​​! Seu veículo foi marcado como vendido!");
        return res.data;
      } catch (err) {
        toast.error("Houve um problema ao realizar a operação.");
        console.log(err);
        return null;
      } finally {
        setLoadingVehicle(false);
      }
    },
    []
  );

  const publish = useCallback(async (vehicleId: string) => {
    setLoadingVehicle(true);
    try {
      const resp = await vehicleService.publishVehicle(vehicleId);
      toast.success(
        `Publição realizada com sucesso 🚗​​​! Acesse: ${resp.data.url}`
      );
      return resp.data as PublishResponse;
    } catch (err) {
      toast.error(
        "Nesta versão, somente é possível publicar um único veículo."
      );
      return null;
    } finally {
      setLoadingVehicle(false);
    }
  }, []);

  const checkVehicles = useCallback(async (vehicleId: string) => {
    setLoadingVehicle(true);
    try {
      const resp = await vehicleService.checkVehicle(vehicleId);
      console.log(resp.data);
      setQuestions(resp.data);
    } catch (err) {
      toast.error("Houve um erro ao buscar as perguntas!");
      return null;
    } finally {
      setLoadingVehicle(false);
    }
  }, []);

  const answerQuestion = useCallback(async (questionId: string, answer: string) => {
    setLoadingAnswer(true);
    try {
      const resp = await vehicleService.answerQuestion(questionId, answer);
      return true;
    } catch (err) {
      toast.error("Houve um erro ao responder a pergunta!");
      return null;
    } finally {
      setLoadingAnswer(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      loadingVehicle,
      vehicles,
      getVehicles,
      saveVehicle,
      handleImageUpload,
      findVehicleById,
      vehicle,
      setVehicle,
      updateVehicle,
      deleteImages,
      publish,
      updateVehicleMercadoLivre,
      deleteVehicleMercadoLivre,
      checkVehicles,
      questions,
      answerQuestion,
      loadingAnswer,
      createPublication,
      soldVehicle
    }),
    [
      loadingVehicle,
      vehicles,
      getVehicles,
      saveVehicle,
      handleImageUpload,
      findVehicleById,
      vehicle,
      setVehicle,
      updateVehicle,
      deleteImages,
      publish,
      updateVehicleMercadoLivre,
      deleteVehicleMercadoLivre,
      checkVehicles,
      questions,
      answerQuestion,
      loadingAnswer,
      createPublication,
      soldVehicle
    ]
  );

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};

const useVehicles = () => {
  return useContext(VehicleContext);
};

export { VehicleProvider, useVehicles };
