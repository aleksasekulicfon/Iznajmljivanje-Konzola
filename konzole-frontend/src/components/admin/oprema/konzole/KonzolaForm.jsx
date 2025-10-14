import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as OpremaService from "../../../../services/OpremaService";

export default function KonzolaForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const [form, setForm] = useState({ naziv:"", proizvodjac:"", cena:"", inventarskiBroj:"" });
  const [err, setErr] = useState("");

  useEffect(()=>{ if(!isNew) OpremaService.getKonzola(id).then(setForm); }, [id,isNew]);

  async function onSubmit(e){
    e.preventDefault(); setErr("");
    try{
      if(isNew) await OpremaService.createKonzola(form);
      else await OpremaService.updateKonzola(id, form);
      nav("/admin/oprema/konzole");
    }catch(e){ setErr(e?.response?.data?.message || "Greška.");}
  }

  return (
    <div className="container mt-4" style={{maxWidth:560}}>
      <h4 className="mb-3">{isNew? "Nova konzola":"Izmena konzole"}</h4>
      {["naziv","proizvodjac","cena","inventarskiBroj"].map(f=>(
        <div className="mb-2" key={f}>
          <label className="form-label text-capitalize">{f}</label>
          <input className="form-control" value={form[f]||""} onChange={(e)=>setForm({...form, [f]: e.target.value})}/>
        </div>
      ))}
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={onSubmit}>Sačuvaj</button>
        <button className="btn btn-outline-secondary" onClick={()=>nav(-1)} type="button">Nazad</button>
      </div>
    </div>
  );
}