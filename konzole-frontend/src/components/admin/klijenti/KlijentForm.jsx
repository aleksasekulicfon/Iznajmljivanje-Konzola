import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as KlijentService from "../../../services/KlijentService";

export default function KlijentForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();

  const [form, setForm] = useState({ ime: "", prezime: "", korisnickoIme: "", email: "", telefon: "" });
  const [err, setErr] = useState("");

  useEffect(() => { if (!isNew) KlijentService.getById(id).then(setForm); }, [id, isNew]);

  async function onSubmit(e){
    e.preventDefault();
    try {
      if (isNew) await KlijentService.create(form);
      else await KlijentService.update(id, form);
      nav("/admin/klijenti");
    } catch (e) { setErr(e?.response?.data?.message || "Greška."); }
  }

  return (
    <div className="container mt-4" style={{maxWidth:560}}>
      <h4 className="mb-3">{isNew ? "Novi klijent" : `Izmena: #${id}`}</h4>
      <form onSubmit={onSubmit}>
        {["ime","prezime","korisnickoIme","email","telefon"].map((f)=>(
          <div className="mb-2" key={f}>
            <label className="form-label text-capitalize">{f}</label>
            <input className="form-control" value={form[f]||""} onChange={(e)=>setForm({...form,[f]:e.target.value})}/>
          </div>
        ))}
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary">Sačuvaj</button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>nav(-1)}>Nazad</button>
        </div>
      </form>
    </div>
  );
}