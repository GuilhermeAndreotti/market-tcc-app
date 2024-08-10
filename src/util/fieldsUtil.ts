import { GetProp, UploadFile, UploadProps } from "antd";
import { Vehicle } from "../model/vehicle.model";

export const checkYear = (_: any, value: string) => {
  const currentYear = new Date().getFullYear();
  const year = parseInt(value, 10);

  if (!year || year < 1900 || year > currentYear) {
    return Promise.reject("Insira um ano válido entre 1900 e o ano atual.");
  }
  return Promise.resolve();
};

export const validatePassengerCapacity = (_: any, value: number) => {
  if (value < 0) {
    return Promise.reject(
      "A quantidade de passageiros deve ser um número positivo."
    );
  }
  return Promise.resolve();
};

export const validatePositiveNumber = (_: any, value: number) => {
  if (value && value < 0) {
    return Promise.reject("Insira um valor válido e positivo.");
  } else {
    return Promise.resolve();
  }
};

export const handleUploadImages = async (
  edit: boolean,
  values: Vehicle,
  vehicle: Vehicle,
  fileList: UploadFile[],
  handleImageUpload: any,
  updatedValues: Vehicle
) => {
  let objImgEdit;
  let uploadPromises;

  if (edit) {
    updatedValues = {
      ...updatedValues,
      image1: vehicle.image1 ?? undefined,
      image2: vehicle.image2 ?? undefined,
      image3: vehicle.image3 ?? undefined,
      image4: vehicle.image4 ?? undefined,
    };
    objImgEdit = fileList.filter((obj) => !obj.hasOwnProperty("url"));
    uploadPromises = objImgEdit.map((file: any) => handleImageUpload(file));
  } else {
    uploadPromises = fileList.map((file: any) => handleImageUpload(file));
  }

  const imageUrls = await Promise.all(uploadPromises);

  if (!edit) {
    imageUrls.forEach((url, index) => {
      (updatedValues as any)[`image${index + 1}`] = url;
    });
  } else {
    imageUrls.forEach((url, index) => {
      for (let i = 1; i <= 4; i++) {
        const propName = `image${i}`;
        if (!(updatedValues as any)[propName]) {
          (updatedValues as any)[propName] = url;
          break;
        }
      }
    });
  }
  return updatedValues;
};

export const removeImageOnRemoveEdit = (
  fileList: UploadFile[],
  vehicle: Vehicle,
  newFileList: UploadFile[]
) => {
  //const objetosComUrl = fileList.filter(obj => obj.hasOwnProperty('url'));
  if (newFileList.length < fileList.length) {
    const urlRemovida = fileList.find(
      (obj) => !newFileList.some((newObj) => newObj.url === obj.url)
    )?.url;

    if (urlRemovida) {
      for (let i = 1; i <= 4; i++) {
        const imageUrl = (vehicle as any)[`image${i}`];
        if (imageUrl === urlRemovida) {
          delete (vehicle as any)[`image${i}`];
          break;
        }
      }
    }
  }
};

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const translateStatus = (status: string) =>{
  if(status === 'UNANSWERED'){
    return 'Sem resposta'
  } else if(status === 'ANSWERED'){
    return 'Respondido'
  } else {
    return '-';
  }

}
