import axios from "axios";

// npr. http://localhost:8080/api  (dev)  ili  /api (prod/reverse-proxy)
const base = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

const http = axios.create({
  baseURL: base,
  // withCredentials: true, // uključi ako budeš koristio cookie-session
  timeout: 10000,
});

export default http;