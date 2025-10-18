import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    try {
      await login(korisnickoIme, lozinka);
      setSuccess("✅ Uspešno ste se ulogovali!");
      alert("Uspešno ste se ulogovali!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const msg = error?.response?.data?.message || "❌ Neuspešna prijava.";
      setErr(msg);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🎮 Prijava</h1>
        <p>Unesite svoje podatke za pristup</p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label>Korisničko ime</label>
            <input
              type="text"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
              placeholder="Unesite korisničko ime"
              required
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              placeholder="Unesite lozinku"
              required
            />
          </div>

          {err && <div className="msg error">{err}</div>}
          {success && <div className="msg success">{success}</div>}

          <button type="submit" className="btn-login">
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}