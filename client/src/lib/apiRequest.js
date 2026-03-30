import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8800";

const apiRequest = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10000, // 10s
});

export default apiRequest;
