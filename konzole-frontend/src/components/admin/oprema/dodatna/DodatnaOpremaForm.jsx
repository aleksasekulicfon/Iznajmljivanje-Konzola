import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as OpremaService from "../../../../services/OpremaService";
import "./DodatnaOpremaForm.css";

export default function DodatnaOpremaForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();

  const [form, setForm] = useState({
    naziv: "",
    proizvodjac: "",
    cena: "",
    tip: "",
    zalihe: "",
    stanje: "SLOBODNA",
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isNew) OpremaService.getDodatna(id).then(setForm);
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.naziv.trim() || !form.proizvodjac.trim() || !form.tip.trim()) {
      setErr("Sva tekstualna polja moraju biti popunjena.");
      return;
    }
    if (isNaN(form.cena) || form.cena <= 0) {
      setErr("Cena mora biti broj veći od nule.");
      return;
    }
    if (isNaN(form.zalihe) || form.zalihe <= 0) {
      setErr("Zalihe ne mogu biti nula ili negativne.");
      return;
    }

    try {
      if (isNew) await OpremaService.createDodatna(form);
      else await OpremaService.updateDodatna(id, form);
      nav("/admin/oprema/dodatna");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri čuvanju.");
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          🎮 {isNew ? "Nova dodatna oprema" : "Izmena dodatne opreme"}
        </h2>

        <form onSubmit={onSubmit}>
          {/* Tekstualna polja */}
          {["naziv", "proizvodjac", "tip"].map((f) => (
            <div className="form-group" key={f}>
              <label>{f.toUpperCase()}</label>
              <input
                type="text"
                value={form[f] || ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                required
                placeholder={`Unesi ${f}`}
              />
            </div>
          ))}

          {/* Cena */}
          <div className="form-group">
            <label>CENA</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cena}
              onChange={(e) => setForm({ ...form, cena: e.target.value })}
              placeholder="Unesi cenu (npr. 1500)"
              required
            />
          </div>

          {/* Zalihe */}
          <div className="form-group">
            <label>ZALIHE</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.zalihe}
              onChange={(e) => setForm({ ...form, zalihe: e.target.value })}
              placeholder="Unesi broj zaliha"
              required
            />
          </div>

          {/* Stanje select */}
          <div className="form-group">
            <label>STANJE</label>
            <select
              value={form.stanje}
              onChange={(e) => setForm({ ...form, stanje: e.target.value })}
            >
              <option value="SLOBODNA">Slobodna</option>
              <option value="ZAUZETA">Zauzeta</option>
              <option value="SERVIS">Servis</option>
            </select>
          </div>

          {err && <div className="error">{err}</div>}

          <div className="btn-row">
            <button type="submit" className="btn-primary">💾 Sačuvaj</button>
            <button type="button" className="btn-secondary" onClick={() => nav(-1)}>
              ⬅ Nazad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}