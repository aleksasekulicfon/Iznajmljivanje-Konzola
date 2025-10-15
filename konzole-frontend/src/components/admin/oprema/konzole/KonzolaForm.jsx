import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as OpremaService from "../../../../services/OpremaService";
import "./KonzolaForm.css";

export default function KonzolaForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState({
    naziv: "",
    proizvodjac: "",
    cena: "",
    inventarskiBroj: "",
    stanje: "SLOBODNA",
    zalihe: "",
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      if (!isNew) {
        try {
          const data = await OpremaService.getKonzola(id);
          setForm({
            naziv: data.naziv || "",
            proizvodjac: data.proizvodjac || "",
            cena: data.cena || "",
            inventarskiBroj: data.inventarskiBroj || "",
            stanje: data.stanje || "SLOBODNA",
            zalihe: data.zalihe || "",
          });
        } catch {
          setErr("Greška pri učitavanju konzole.");
        }
      } else {
        setForm({
          naziv: "",
          proizvodjac: "",
          cena: "",
          inventarskiBroj: "",
          stanje: "SLOBODNA",
          zalihe: "",
        });
      }
    }
    load();
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const cleanForm = {
        ...form,
        naziv: form.naziv.trim(),
        proizvodjac: form.proizvodjac.trim(),
        inventarskiBroj: form.inventarskiBroj.trim(),
        zalihe: Number(form.zalihe) || 0,
      };

      if (isNew) await OpremaService.createKonzola(cleanForm);
      else await OpremaService.updateKonzola(id, cleanForm);

      nav("/admin/oprema/konzole");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri čuvanju podataka.");
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">
          {isNew ? "🎮 Nova konzola" : "✏️ Izmena konzole"}
        </h2>

        <form onSubmit={onSubmit}>
          {["naziv", "proizvodjac", "cena", "inventarskiBroj"].map((f) => (
            <div className="input-group" key={f}>
              <label>{f.toUpperCase()}</label>
              <input
                type={f === "cena" ? "number" : "text"}
                value={form[f] || ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                required
                min={f === "cena" ? 0 : undefined}
                step={f === "cena" ? "0.01" : undefined}
              />
            </div>
          ))}

          {/* Novo polje za zalihe */}
          <div className="input-group">
            <label>ZALIHE</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.zalihe}
              onChange={(e) =>
                setForm({ ...form, zalihe: Math.max(0, e.target.value) })
              }
              required
            />
          </div>

          {/* Select za stanje */}
          <div className="input-group">
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

          {err && <div className="error-msg">{err}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-save">
              💾 {isNew ? "Sačuvaj konzolu" : "Sačuvaj izmene"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => nav(-1)}
            >
              ⬅️ Nazad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}