import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("❌ VITE_API_URL is not defined");
}

const apiRequest = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10000,
});

export default apiRequest;
