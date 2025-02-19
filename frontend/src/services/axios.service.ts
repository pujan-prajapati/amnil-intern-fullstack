/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_URL } from "../constants";
import { getLocalStore } from "../helpers";

export const http = axios.create({
  baseURL: `${API_URL}`,
  timeout: 30000,
  withCredentials: true,
  timeoutErrorMessage: "Server timed out",
  headers: {
    "Content-Type": "application/json",
  },
});

const getHeaders = (strict: boolean): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (strict) {
    const token = getLocalStore("token");
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
  params: Record<string, any> | null = null,
  is_strict = false
) => {
  const headers = getHeaders(is_strict);

  const response = await http.get(url, { headers: headers, params: params });
  return response.data;
};

export const uploader = (
  url: string,
  method: "POST" | "PUT",
  data: Record<string, any> = {},
  fieldName: string,
  file?: File | File[],
  isStrict = false
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    const formData = new FormData();

    // ✅ Append File(s) to FormData
    if (file) {
      if (Array.isArray(file)) {
        file.forEach((image) => {
          formData.append(fieldName, image, image.name);
        });
      } else {
        formData.append(fieldName, file, file.name);
      }
    }

    // ✅ Append Other Data to FormData (Handles Arrays Too)
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // ✅ Handle Response Properly
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
          resolve(xmlhttp.response ? JSON.parse(xmlhttp.response) : {});
        } else {
          reject(
            new Error(
              `Upload failed with status ${xmlhttp.status}: ${xmlhttp.statusText}`
            )
          );
        }
      }
    };

    xmlhttp.open(method, `${API_URL}${url}`);

    // ✅ Handle Authentication Token Properly
    if (isStrict) {
      try {
        const token = JSON.parse(localStorage.getItem("token") || "null");
        if (token) {
          xmlhttp.setRequestHeader("Authorization", token);
        }
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }

    xmlhttp.send(formData);
  });
};
