import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as KlijentService from "../../services/KlijentService";
import * as RadnikService from "../../services/RadnikService";
import * as MestoService from "../../services/MestoService";
import "./ProfilForm.css";

export default function ProfilForm({ role }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [mesta, setMesta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (role === "KLIJENT") {
          const data = await KlijentService.getById(user.id);
          const allMesta = await MestoService.list();
          setForm(data);
          setMesta(allMesta);
        } else {
          const data = await RadnikService.getById(user.id);
          setForm(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role, user.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dto = { ...form };
    if (!dto.lozinka) delete dto.lozinka;

    try {
      if (role === "RADNIK") await RadnikService.update(user.id, dto);
      else await KlijentService.update(user.id, dto);

      alert("✅ Profil uspešno ažuriran!");
      navigate(role === "RADNIK" ? "/admin" : "/app");
    } catch (err) {
      console.error(err);
      alert("❌ Greška prilikom ažuriranja profila.");
    }
  }

  if (loading) return <div className="text-center mt-5">Učitavanje...</div>;

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="glass-form p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">🧑‍💼 Izmena profila</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Ime</label>
              <input
                name="ime"
                className="form-control"
                value={form.ime || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Prezime</label>
              <input
                name="prezime"
                className="form-control"
                value={form.prezime || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Korisničko ime</label>
            <input
              name="korisnickoIme"
              className="form-control"
              value={form.korisnickoIme || ""}
              onChange={handleChange}
            />
          </div>

          {role === "KLIJENT" && (
            <>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  className="form-control"
                  value={form.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Telefon</label>
                <input
                  name="telefon"
                  className="form-control"
                  value={form.telefon || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mesto</label>
                <select
                  className="form-select"
                  value={form.mestoId || ""}
                  onChange={(e) =>
                    setForm({ ...form, mestoId: Number(e.target.value) })
                  }
                >
                  <option value="">-- Izaberi mesto --</option>
                  {mesta.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.naziv}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Nova lozinka (opciono)</label>
            <input
              name="lozinka"
              type="password"
              className="form-control"
              value={form.lozinka || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-save w-100 mt-3">
            Sačuvaj izmene
          </button>
        </form>
      </div>
    </div>
  );
}
