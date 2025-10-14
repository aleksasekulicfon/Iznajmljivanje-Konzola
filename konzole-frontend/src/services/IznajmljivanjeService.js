import { api } from "../api/api";

export async function list(params){ return (await api.get("/iznajmljivanja", { params })).data; }
export async function get(id){ return (await api.get(`/iznajmljivanja/${id}`)).data; }
export async function create(dto){ return (await api.post("/iznajmljivanja", dto)).data; }
export async function update(id,dto){ return (await api.put(`/iznajmljivanja/${id}`, dto)).data; }
export async function finish(id){ return (await api.put(`/iznajmljivanja/${id}/zavrsi`)).data; }

// stavke kroz pod-rute
export async function listStavke(iznId){ return (await api.get(`/iznajmljivanja/${iznId}/stavke`)).data; }
export async function addStavka(iznId, dto){ return (await api.post(`/iznajmljivanja/${iznId}/stavke`, dto)).data; }
export async function updateStavka(iznId, sid, dto){ return (await api.put(`/iznajmljivanja/${iznId}/stavke/${sid}`, dto)).data; }
export async function removeStavka(iznId, sid){ return (await api.delete(`/iznajmljivanja/${iznId}/stavke/${sid}`)).data; }