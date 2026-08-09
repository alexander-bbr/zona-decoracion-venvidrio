import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://127.0.0.1:8000/api";

export const useApi = () => {
  const { token } = useAuth();

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return api;
};
