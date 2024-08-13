import { JWT_STORAGE_KEY } from "@/constants/keys";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(JWT_STORAGE_KEY);
  console.log(token);
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});
