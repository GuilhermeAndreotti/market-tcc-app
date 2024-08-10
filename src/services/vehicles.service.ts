import { AxiosResponse } from "axios";
import * as api from "./api.service";
import { Vehicle } from "../model/vehicle.model";
import { UpdateVehicle } from "../model/update-vehicle.model";

export class VehicleService {
  baseUrl = "vehicles";

  async get(): Promise<AxiosResponse<Vehicle[]>> {
    return api.getting<Vehicle[]>(`${this.baseUrl}`);
  }

  async createVehicle(vehicleBody: Vehicle) {
    return await api.posting(`${this.baseUrl}`, vehicleBody);
  }

  async getById(vehicleId: string) {
    return await api.getting(`${this.baseUrl}/find-one/${vehicleId}`);
  }

  async updatePublication(vehicleId: string, body: UpdateVehicle) {
    return await api.posting(`${this.baseUrl}/create-publication/${vehicleId}`, body);
  }

  async updateVehicle(vehicleId: string, body: UpdateVehicle) {
    return await api.patching(`${this.baseUrl}/${vehicleId}`, body);
  }

  async updateVehicleMercadoLivre(vehicleId: string) {
    return await api.posting(`${this.baseUrl}/update/items`, {
      vehicleId: vehicleId,
    });
  }

  async soldVehicle(
    vehicleId: string,
  ) {
    return await api.posting(`${this.baseUrl}/sold/items`, {
      vehicleId: vehicleId,
    });
  }

  async deleteVehicleMercadoLivre(
    vehicleId: string,
    itemId: string,
    deleteType: string
  ) {
    return await api.posting(`${this.baseUrl}/delete/items`, {
      itemId: itemId,
      deleting: deleteType,
      vehicleId: vehicleId,
    });
  }

  async publishVehicle(vehicleId: string) {
    return await api.posting(`${this.baseUrl}/items`, {
      vehicleId: vehicleId,
    });
  }

  async checkVehicle(vehicleId: string) {
    return await api.getting(`${this.baseUrl}/check/items`, {
      vehicleId: vehicleId,
    });
  }

  async answerQuestion(questionId: string, answer: string) {
    return await api.posting(`${this.baseUrl}/answer/items`, {
      questionId: questionId,
      answer: answer
    });
  }
}
