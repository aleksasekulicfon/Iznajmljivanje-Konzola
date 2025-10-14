import { api } from "../api/api";

// Konzole
export async function listKonzole(){ return (await api.get("/konzole")).data; }
export async function getKonzola(id){ return (await api.get(`/konzole/${id}`)).data; }
export async function createKonzola(dto){ return (await api.post("/konzole", dto)).data; }
export async function updateKonzola(id,dto){ return (await api.put(`/konzole/${id}`, dto)).data; }
export async function removeKonzola(id){ return (await api.delete(`/konzole/${id}`)).data; }

// Dodatna oprema
export async function listDodatna(){ return (await api.get("/dodatna-oprema")).data; }
export async function getDodatna(id){ return (await api.get(`/dodatna-oprema/${id}`)).data; }
export async function createDodatna(dto){ return (await api.post("/dodatna-oprema", dto)).data; }
export async function updateDodatna(id,dto){ return (await api.put(`/dodatna-oprema/${id}`, dto)).data; }
export async function removeDodatna(id){ return (await api.delete(`/dodatna-oprema/${id}`)).data; }