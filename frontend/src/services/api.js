import axios from "axios";
import { supabase } from "./supabase";

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  return url.replace(/\/+$/, "");
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);
export const isApiConfigured = Boolean(API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL || "/api",
});

API.interceptors.request.use(
  async (config) => {
    const { data } = supabase
      ? await supabase.auth.getSession()
      : { data: { session: null } };
    const token = data.session?.access_token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
