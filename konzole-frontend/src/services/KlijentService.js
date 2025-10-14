import { api } from "../api/api";

export async function getAll(){ return (await api.get("/klijenti")).data; }
export async function getById(id){ return (await api.get(`/klijenti/${id}`)).data; }
export async function create(dto){ return (await api.post("/klijenti", dto)).data; }
export async function update(id,dto){ return (await api.put(`/klijenti/${id}`, dto)).data; }
export async function remove(id){ return (await api.delete(`/klijenti/${id}`)).data; }

export async function topUp(id, iznos){
  return (await api.post(`/klijenti/${id}/topup`, null, { params: { iznos } })).data;
}