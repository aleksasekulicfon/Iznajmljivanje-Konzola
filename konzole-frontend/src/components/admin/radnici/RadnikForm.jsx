import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as RadnikService from "../../../services/RadnikService";

export default function RadnikForm() {
  const { id } = useParams(); // "new" | id
  const isNew = id === "new";
  const nav = useNavigate();

  const [form, setForm] = useState({ ime: "", prezime: "", korisnickoIme: "" });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isNew) RadnikService.getById(id).then(setForm);
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (isNew) await RadnikService.create(form);
      else await RadnikService.update(id, form);
      nav("/admin/radnici");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška.");
    }
  }

  return (
    <div className="container mt-4" style={{maxWidth: 560}}>
      <h4 className="mb-3">{isNew ? "Novi radnik" : `Izmena: #${id}`}</h4>
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label className="form-label">Ime</label>
          <input className="form-control"
                 value={form.ime} onChange={(e)=>setForm({...form, ime: e.target.value})}/>
        </div>
        <div className="mb-2">
          <label className="form-label">Prezime</label>
          <input className="form-control"
                 value={form.prezime} onChange={(e)=>setForm({...form, prezime: e.target.value})}/>
        </div>
        <div className="mb-2">
          <label className="form-label">Korisničko ime</label>
          <input className="form-control"
                 value={form.korisnickoIme} onChange={(e)=>setForm({...form, korisnickoIme: e.target.value})}/>
        </div>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary">Sačuvaj</button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>nav(-1)}>Nazad</button>
        </div>
      </form>
    </div>
  );
}