import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { API_URL } from "../constants";
import { message } from "antd";

export const http = axios.create({
  baseURL: `${API_URL}`,
  timeout: 30000,
  withCredentials: true,
  timeoutErrorMessage: "Server timed out",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to modify headers for file uploads
http.interceptors.request.use(
  (config) => {
    // Check if data is FormData
    if (config.data instanceof FormData) {
      // Automatically set Content-Type to multipart/form-data
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use((response) => {
  if (response.status === StatusCodes.NOT_FOUND) {
    message.error("API does not exists");
  } else if (response.status === StatusCodes.UNAUTHORIZED) {
    message.error("Unauthorized access");
  } else if (response.status === StatusCodes.FORBIDDEN) {
    message.error("Access denied");
  } else if (response.status === StatusCodes.UNPROCESSABLE_ENTITY) {
    message.error("Could not process the request");
  }

  return response;
});

const getHeaders = (strict: boolean): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (strict) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const httpPost = async <T>(url: string, data: T, is_strict = false) => {
  const headers = getHeaders(is_strict);

  const response = await http.post(url, data, { headers: headers });

  return response.data;
};

export const httpDelete = async (url: string, is_strict = false) => {
  const headers = getHeaders(is_strict);

  const response = await http.delete(url, { headers: headers });

  return response.data;
};

export const httpPut = async <T>(url: string, data: T, is_strict = false) => {
  const headers = getHeaders(is_strict);
  const response = await http.put(url, data, { headers: headers });
  return response.data;
};

export const httpGet = async (
  url: string,
  params = null,
  is_strict = false
) => {
  const headers = getHeaders(is_strict);

  const response = await http.get(url, { headers: headers, params: params });
  return response.data;
};
