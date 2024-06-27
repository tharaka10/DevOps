import axios from 'axios';
import { getToken } from '../utils/tokenManager';

const baseURL = 'http://localhost:4000/api';

export const RegisterAPI = (data) => {
  return axios.post(`${baseURL}/auth/register`, data);
};

export const LoginAPI = (data) => {
  return axios.post(`${baseURL}/auth/login`, data);
};

export const GetCompanyDetailsAPI = () => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.get(`${baseURL}/company`, config);
  }
};

export const UpdateCompanyDetailsAPI = (data) => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.put(`${baseURL}/company/update-details`, data, config);
  }
};

export const CreateDeliveryOrderAPI = (data) => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.post(`${baseURL}/delivery/`, data, config);
  }
};

export const GetDeliveryHistoryAPI = () => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.get(`${baseURL}/delivery/history`, config);
  }
};

export const DeleteOrderAPI = (orderId) => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.delete(`${baseURL}/delivery/${orderId}`, config);
  }
};

export const GetDeliveryBacklogAPI = () => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.get(`${baseURL}/delivery/all`, config);
  }
};

export const UpdateDeliveryDetailsAPI = (orderId, data) => {
  const token = getToken();
  if (token) {
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return axios.put(`${baseURL}/delivery/${orderId}`, data, config);
  }
};
