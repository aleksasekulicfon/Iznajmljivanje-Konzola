import { useState } from "react";
import * as IznService from "../../services/IznajmljivanjeService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RentalNew(){
  const nav = useNavigate();
  const { user } = useAuth();
  const [f, setF] = useState({ opremaId:"", cena:"", kolicina:1, ukupnoVreme:1 });
  const [err, setErr] = useState("");

  async function onSubmit(e){
    e.preventDefault(); setErr("");
    try{
      const payload = {
        klijentId: user?.id,
        stavke: [{ rb:1, opremaId: Number(f.opremaId), cena: Number(f.cena), kolicina: Number(f.kolicina), ukupnoVreme: Number(f.ukupnoVreme) }]
      };
      const created = await IznService.create(payload);
      nav(`/app/rentals`);
    }catch(e){ setErr(e?.response?.data?.message || "Greška.");}
  }

  return (
    <div className="container mt-4" style={{maxWidth:560}}>
      <h4 className="mb-3">Novo iznajmljivanje</h4>
      {["opremaId","cena","kolicina","ukupnoVreme"].map(n=>(
        <div className="mb-2" key={n}>
          <label className="form-label text-capitalize">{n}</label>
          <input className="form-control" value={f[n]} onChange={(e)=>setF({...f, [n]: e.target.value})}/>
        </div>
      ))}
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-primary" onClick={onSubmit}>Kreiraj</button>
        <button className="btn btn-outline-secondary" onClick={()=>nav(-1)} type="button">Nazad</button>
      </div>
    </div>
  );
}