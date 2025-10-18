import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as KlijentService from "../../services/KlijentService";
import * as MestoService from "../../services/MestoService";
import "./Register.css";

export default function RegisterClient() {
  const [form, setForm] = useState({
    ime: "",
    prezime: "",
    korisnickoIme: "",
    email: "",
    telefon: "",
    lozinka: "",
    mestoId: "",
  });

  const [mesta, setMesta] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMesta() {
      try {
        const data = await MestoService.list();
        setMesta(data);
      } catch (err) {
        console.error("Greška pri učitavanju mesta:", err);
      }
    }
    loadMesta();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d+$/.test(form.telefon)) {
      setError("Telefon može sadržati samo brojeve.");
      return;
    }

    try {
      await KlijentService.create(form);
      alert("Sistem je registrovao klijenta!");
      navigate("/login");
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Došlo je do greške prilikom registracije.");
      }
      console.error(err);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h3 className="register-title">
          <i className="bi bi-person-plus-fill"></i> Novi klijent
        </h3>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="ime"
            placeholder="Ime"
            value={form.ime}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="prezime"
            placeholder="Prezime"
            value={form.prezime}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="korisnickoIme"
            placeholder="Korisničko ime"
            value={form.korisnickoIme}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefon"
            placeholder="Telefon"
            value={form.telefon}
            onChange={handleChange}
            required
          />

          {/* 🔽 NOVO: Dropdown za Mesto */}
          <select
            name="mestoId"
            value={form.mestoId}
            onChange={handleChange}
            required
            className="select-mesto"
          >
            <option value="">-- Izaberi mesto --</option>
            {mesta.map((m) => (
              <option key={m.id} value={m.id}>
                {m.naziv}
              </option>
            ))}
          </select>

          <input
            type="password"
            name="lozinka"
            placeholder="Lozinka"
            value={form.lozinka}
            onChange={handleChange}
            required
          />

          <div className="register-note">
            Kreiranjem naloga registrujete se kao <strong>klijent</strong>.
          </div>

          <div className="register-actions">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              ← Nazad
            </button>
            <button type="submit" className="btn-save">
              💾 Sačuvaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
