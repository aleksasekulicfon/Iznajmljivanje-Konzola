import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as RadnikService from "../../../services/RadnikService";
import "./RadnikForm.css";

export default function RadnikForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();

  const [form, setForm] = useState({
    ime: "",
    prezime: "",
    korisnickoIme: "",
    lozinka: "", // 🔹 prazno po defaultu
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isNew) {
      RadnikService.getById(id).then(setForm);
    }
  }, [id, isNew]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, lozinka: form.lozinka || "" };

      if (isNew) await RadnikService.create(payload);
      else await RadnikService.update(id, payload);

      nav("/admin/radnici");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri čuvanju podataka.");
    }
  }

  return (
    <div className="radnik-form-container container mt-4 shine-in">
      <h3 className="form-title mb-3">
        {isNew ? "➕ Novi radnik" : `✏️ Izmena radnika #${id}`}
      </h3>

      <form className="radnik-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Ime</label>
          <input
            type="text"
            value={form.ime}
            onChange={(e) => setForm({ ...form, ime: e.target.value })}
            placeholder="Unesi ime..."
          />
        </div>

        <div className="form-group">
          <label>Prezime</label>
          <input
            type="text"
            value={form.prezime}
            onChange={(e) => setForm({ ...form, prezime: e.target.value })}
            placeholder="Unesi prezime..."
          />
        </div>

        <div className="form-group">
          <label>Korisničko ime</label>
          <input
            type="text"
            value={form.korisnickoIme}
            onChange={(e) =>
              setForm({ ...form, korisnickoIme: e.target.value })
            }
            placeholder="Unesi korisničko ime..."
          />
        </div>

        {err && <div className="error-box">{err}</div>}

        <div className="button-row">
          <button className="btn-save" type="submit">
            💾 Sačuvaj
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => nav(-1)}
          >
            ↩️ Nazad
          </button>
        </div>
      </form>
    </div>
  );
}