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
    kredit: 0,
    lozinka: "",
  });

  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isNew) {
      KlijentService.getById(id).then(setForm);
    }
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();

    if (
      form.ime.length < 3 ||
      form.prezime.length < 3 ||
      form.korisnickoIme.length < 3 ||
      (form.email && form.email.length < 3) ||
      form.telefon.length < 3
    ) {
      setErr("Sva polja moraju imati najmanje 3 karaktera.");
      return;
    }

    if (!/^\d+$/.test(form.telefon)) {
      setErr("Telefon može sadržati samo brojeve.");
      return;
    }
    try {
      const payload = {
        ...form,
        kredit: form.kredit ?? 0,
        lozinka: form.lozinka ?? "",
      };
      if (isNew) {
        await KlijentService.create(payload);
        alert("✅ Sistem je kreirao klijenta!");
      } else {
        await KlijentService.update(id, payload);
        alert("✅ Sistem je promenio klijenta!");
      }
      nav("/admin/klijenti");
    } catch (e) {
      setErr(e?.response?.data?.message || "Došlo je do greške.");
    }
  }

  return (
    <div className="klijent-form">
      <h3 className="form-title">
        {isNew ? "➕ Novi klijent" : `✏️ Izmena klijenta #${id}`}
      </h3>

      <form onSubmit={onSubmit} className="form-box">
        <div className="form-grid">
          <div className="form-group">
            <label>Ime</label>
            <input
              className="modern-input"
              value={form.ime}
              onChange={(e) => setForm({ ...form, ime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Prezime</label>
            <input
              className="modern-input"
              value={form.prezime}
              onChange={(e) => setForm({ ...form, prezime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Korisničko ime</label>
            <input
              className="modern-input"
              value={form.korisnickoIme}
              onChange={(e) =>
                setForm({ ...form, korisnickoIme: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="modern-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              className="modern-input"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Kredit (€)</label>
            <input
              type="number"
              className={`modern-input ${isNew ? "input-disabled" : ""}`}
              value={form.kredit}
              onChange={(e) =>
                setForm({ ...form, kredit: Number(e.target.value) })
              }
              disabled={isNew}
            />
            {isNew && (
              <small className="text-muted">
                Kredit se automatski postavlja na 0.
              </small>
            )}
          </div>
        </div>

        {err && <div className="alert-error">{err}</div>}

        <div className="button-row">
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
