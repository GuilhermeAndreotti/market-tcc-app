import { AxiosResponse } from "axios";
import { Admin } from "../model/admin.model";
import * as api from "./api.service";

export class AdminService {
  baseUrl = "admin";
  tokenUrl = "oauth/token/";

  async getToken(code: string) {
    return api.postingMlb(`${this.tokenUrl}${code}`);
  }

  async checkToken() {
    return api.getting(`${this.baseUrl}/check-token`);
  }

  async remove() {
    return api.getting(`${this.baseUrl}/remove-connection`);
  }

  async get(): Promise<AxiosResponse<Admin[]>> {
    return api.getting<Admin[]>(`${this.baseUrl}`);
  }

  async getById(adminId: string): Promise<AxiosResponse<Admin>> {
    return api.getting<Admin>(`${this.baseUrl}/find-by-id/${adminId}`);
  }

  async login(user: string, access: string) {
    return await api.posting(`${this.baseUrl}/login`, {
      login: user,
      password: access,
    });
  }

  async setPassword(adminId: string, password: string) {
    return await api.posting(`${this.baseUrl}/new-password`, {
      adminId,
      password,
    });
  }
  async createAdmin(adminBody: Admin) {
    return await api.posting(`${this.baseUrl}/register`, adminBody);
  }

  async updateAdmin(adminBody: Partial<Admin>) {
    return await api.posting(`${this.baseUrl}/edit-admin`, adminBody);
  }

  async deleteAdmin(adminId: string){
    return await api.deleting(`${this.baseUrl}/${adminId}`)
  }
}
