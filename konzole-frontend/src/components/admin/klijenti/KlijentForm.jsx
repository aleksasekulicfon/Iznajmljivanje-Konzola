import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as KlijentService from "../../../services/KlijentService";
import "./KlijentForm.css";

export default function KlijentForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();

  const [form, setForm] = useState({
    ime: "",
    prezime: "",
    korisnickoIme: "",
    email: "",
    telefon: "",
    kredit: 0, // 🔹 automatski
    lozinka: "", // 🔹 klijent je kasnije postavlja sam
  });

  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isNew) {
      KlijentService.getById(id).then(setForm);
    }
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, kredit: form.kredit ?? 0, lozinka: form.lozinka ?? "" };
      if (isNew) await KlijentService.create(payload);
      else await KlijentService.update(id, payload);
      nav("/admin/klijenti");
    } catch (e) {
      setErr(e?.response?.data?.message || "Došlo je do greške.");
    }
  }

  return (
    <div className="klijent-form container mt-4 shine-in">
      <h3 className="form-title mb-3">{isNew ? "➕ Novi klijent" : `✏️ Izmena klijenta #${id}`}</h3>

      <form onSubmit={onSubmit} className="form-box">
        <div className="row">
          {["ime", "prezime", "korisnickoIme", "email", "telefon"].map((f) => (
            <div className="col-md-6 mb-3" key={f}>
              <label className="form-label text-capitalize">{f}</label>
              <input
                className="form-control modern-input"
                value={form[f] || ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                required={["ime", "prezime", "korisnickoIme"].includes(f)}
              />
            </div>
          ))}
        </div>

        {/* Kredit prikaz samo informativno */}
        <div className="mb-3">
          <label className="form-label">Kredit (€)</label>
          <input
            type="number"
            className="form-control modern-input"
            value={form.kredit}
            onChange={(e) => setForm({ ...form, kredit: Number(e.target.value) })}
            disabled={isNew} // 🔹 Admin ne unosi kod novog klijenta
          />
          {isNew && <small className="text-muted">Kredit se automatski postavlja na 0.</small>}
        </div>

        {err && <div className="alert alert-danger py-2">{err}</div>}

        <div className="d-flex gap-2 mt-3">
          <button className="btn-save" type="submit">
            💾 Sačuvaj
          </button>
          <button type="button" className="btn-cancel" onClick={() => nav(-1)}>
            ← Nazad
          </button>
        </div>
      </form>
    </div>
  );
}
