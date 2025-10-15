import axios from "axios";

// http://localhost:8080/api
const base = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

const http = axios.create({
  baseURL: base,
  // withCredentials: true za cookies
  timeout: 10000,
});

export default http;