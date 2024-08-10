import axios, { AxiosResponse } from 'axios';

const baseUrl = process.env.REACT_APP_API_KEY;
const axiosInstance = axios.create();

export const getting = <T = any>(path: string, params?: any): Promise<AxiosResponse<T>> => {
    return axios.get(`${baseUrl}/${path}`, { params });
};

export const posting = <T = any>(path: string, body: any, params?: any): Promise<AxiosResponse<T>> => {
    return axios.post(`${baseUrl}/${path}`, body, params);
};

export const postingMlb = <T = any>(path: string, params?: any): Promise<AxiosResponse<T>> => {
    return axios.post(`${baseUrl}/${path}`, { params });;
};

export const putting = (path: string, body: any): Promise<AxiosResponse<any>> => {
    return axios.put(`${baseUrl}/${path}`, body);
};

export const patching = (path: string, body: any): Promise<AxiosResponse<any>> => {
    return axios.patch(`${baseUrl}/${path}`, body);
};

export const deleting = (path: string, query?: any): Promise<AxiosResponse<any>> => {
    return axios.delete(`${baseUrl}/${path}`, query);
};