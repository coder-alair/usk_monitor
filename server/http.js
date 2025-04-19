import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const server = "http://localhost:3000";
// const server = "https://usk-server-yrnc.onrender.com";
const Axios = axios.create({
  baseURL: `${server}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Toast.show({
        type: "error",
        text1: "Session Expired!",
        text2: "Please Login Again.",
      });
      // Note: Ensure navigationRef is correctly set up to navigate
      return navigationRef.current?.navigate("Login");
    }
    return Promise.reject(error?.response);
  }
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error?.response);
  }
);

export class HttpClient {
  static async get(url, params) {
    const response = await Axios.get(url, { params });
    return response?.data;
  }
  static async post(url, data, options) {
    const response = await Axios.post(url, data, options);
    return response?.data;
  }

  static async put(url, data) {
    const response = await Axios.put(url, data);
    return response?.data;
  }

  static async patch(url, data) {
    const response = await Axios.patch(url, data);
    return response?.data;
  }

  static async delete(url) {
    const response = await Axios.delete(url);
    return response?.data;
  }
}
