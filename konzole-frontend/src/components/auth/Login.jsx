import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    console.log(korisnickoIme, lozinka);
    try {
      await login(korisnickoIme, lozinka);
    } catch (error) {
      const msg = error?.response?.data?.message || "Neuspešna prijava.";
      setErr(msg);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <div className="card">
        <div className="card-body">
          <h4 className="mb-3 text-center">Prijava</h4>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Korisničko ime</label>
              <input className="form-control" value={korisnickoIme}
                     onChange={(e) => setKorisnickoIme(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Lozinka</label>
              <input type="password" className="form-control" value={lozinka}
                     onChange={(e) => setLozinka(e.target.value)} />
            </div>
            {err && <div className="alert alert-danger py-2">{err}</div>}
            <div className="d-grid">
              <button className="btn btn-primary">Prijavi se</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}