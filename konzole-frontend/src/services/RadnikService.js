import { api } from "../api/api";



export async function getAll() { return (await api.get("/radnici")).data; }
export async function getById(id) { return (await api.get(`/radnici/${id}`)).data; }
export async function create(dto) { return (await api.post("/radnici", dto)).data; }
export async function update(id, dto) { return (await api.put(`/radnici/${id}`, dto)).data; }
export async function remove(id) { return (await api.delete(`/radnici/${id}`)).data; }