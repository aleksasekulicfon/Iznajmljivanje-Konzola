import { api } from "../api/api";

export async function list() {
  return (await api.get("/mesta")).data;
}