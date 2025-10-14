import { useState } from "react";
import * as KlijentService from "../../services/KlijentService";
import { useAuth } from "../../context/AuthContext";

export default function WalletTopUp(){
  const { user } = useAuth();
  const [iznos, setIznos] = useState("");
  const [msg, setMsg] = useState("");

  async function topUp(){
    setMsg("");
    await KlijentService.topUp(user.id, Number(iznos));
    setMsg("Kredit uvećan.");
    setIznos("");
  }

  return (
    <div className="container mt-4" style={{maxWidth:420}}>
      <h4>Dodaj kredit</h4>
      <div className="input-group">
        <input className="form-control" value={iznos} onChange={(e)=>setIznos(e.target.value)} placeholder="Iznos RSD" />
        <button className="btn btn-primary" onClick={topUp} disabled={!iznos}>Uplati</button>
      </div>
      {msg && <div className="alert alert-success mt-3 py-2">{msg}</div>}
    </div>
  );
}