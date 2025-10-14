import { useState, useEffect } from "react";
import * as IznService from "../../../services/IznajmljivanjeService";
import * as KlijentService from "../../../services/KlijentService";
import * as RadnikService from "../../../services/RadnikService";
import * as OpremaService from "../../../services/OpremaService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import ps5Img from "../../../assets/ps5.jpg";
import xboxImg from "../../../assets/xbox.jpg";
import dualsenseImg from "../../../assets/dualsensecontroller.jpg";
import xboxControllerImg from "../../../assets/xboxcontroller.jpeg";

const slike = {
  "PlayStation 5": ps5Img,
  "Xbox Series X": xboxImg,
  "DualSense Controller": dualsenseImg,
  "Xbox Controller": xboxControllerImg,
};

export default function IznajmljivanjeForm() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [klijenti, setKlijenti] = useState([]);
  const [radnici, setRadnici] = useState([]);
  const [konzole, setKonzole] = useState([]);
  const [dodatnaOprema, setDodatnaOprema] = useState([]);

  const [form, setForm] = useState({
    klijentId: "",
    radnikId: user?.id || "",
    stavke: [],
  });

  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [kl, ra, kon, dop] = await Promise.all([
          KlijentService.getAll(),
          RadnikService.getAll(),
          OpremaService.listKonzole(),
          OpremaService.listDodatna(),
        ]);
        setKlijenti(kl);
        setRadnici(ra);
        setKonzole(kon);
        setDodatnaOprema(dop);
      } catch (e) {
        console.error(e);
        setErr("Greška pri učitavanju podataka.");
      }
    }
    fetchData();
  }, []);

  function addStavka(tip) {
    setForm((f) => ({
      ...f,
      stavke: [
        ...f.stavke,
        { tip, opremaId: "", naziv: "", cena: "", kolicina: 1 },
      ],
    }));
  }

  function setStavka(index, key, value) {
    setForm((f) => ({
      ...f,
      stavke: f.stavke.map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      ),
    }));
  }

  function removeStavka(index) {
    setForm((f) => ({
      ...f,
      stavke: f.stavke.filter((_, i) => i !== index),
    }));
  }

  function onOpremaSelect(index, id, tip) {
    const izvor = tip === "KONZOLA" ? konzole : dodatnaOprema;
    const izabrana = izvor.find((o) => o.id === Number(id));
    if (izabrana) {
      setStavka(index, "opremaId", izabrana.id);
      setStavka(index, "naziv", izabrana.naziv);
      setStavka(index, "cena", izabrana.cenaPoSatu || izabrana.cena);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const payload = {
        klijentId: Number(form.klijentId),
        radnikId: Number(form.radnikId),
        status: "U_TOKU",
        stavke: form.stavke.map((s, i) => ({
          rb: i + 1,
          kolicina: Number(s.kolicina),
          cena: Number(s.cena),
          opremaId: Number(s.opremaId),
        })),
      };

      const created = await IznService.create(payload);
      nav(`/admin/iznajmljivanja/${created.id}`);
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message || "Greška pri kreiranju iznajmljivanja."
      );
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 820 }}>
      <h4 className="mb-3">Novo iznajmljivanje</h4>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Radnik</label>
          <select
            className="form-select"
            value={form.radnikId}
            onChange={(e) => setForm({ ...form, radnikId: e.target.value })}
            required
          >
            <option value="">Izaberi radnika</option>
            {radnici.map((r) => (
              <option key={r.id} value={r.id}>
                {r.ime} {r.prezime}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Klijent</label>
          <select
            className="form-select"
            value={form.klijentId}
            onChange={(e) => setForm({ ...form, klijentId: e.target.value })}
            required
          >
            <option value="">Izaberi klijenta</option>
            {klijenti.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ime} {k.prezime}
              </option>
            ))}
          </select>
        </div>

        <h5 className="mt-4 mb-2">Stavke iznajmljivanja</h5>
        {form.stavke.map((s, index) => (
          <div key={index} className="card p-3 mb-3">
            <div className="row g-2 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Tip opreme</label>
                <input className="form-control" value={s.tip} disabled />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  {s.tip === "KONZOLA" ? "Konzola" : "Dodatna oprema"}
                </label>
                <select
                  className="form-select"
                  value={s.opremaId}
                  onChange={(e) => onOpremaSelect(index, e.target.value, s.tip)}
                  required
                >
                  <option value="">Izaberi...</option>
                  {(s.tip === "KONZOLA" ? konzole : dodatnaOprema).map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.naziv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Cena (eur/sat)</label>
                <input
                  className="form-control"
                  type="number"
                  value={s.cena}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Količina</label>
                <input
                  className="form-control"
                  type="number"
                  value={s.kolicina}
                  onChange={(e) => setStavka(index, "kolicina", e.target.value)}
                  min="1"
                />
              </div>
            </div>

            {s.naziv && slike[s.naziv] && (
              <div className="text-center mt-3">
                <img
                  src={slike[s.naziv]}
                  alt={s.naziv}
                  style={{
                    maxWidth: "180px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  }}
                />
                <div className="mt-2 text-muted">{s.naziv}</div>
              </div>
            )}
            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeStavka(index)}
              >
                🗑️ Ukloni stavku
              </button>
            </div>
          </div>
        ))}

        <div className="d-flex gap-2 mb-3">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => addStavka("KONZOLA")}
          >
            + Dodaj konzolu
          </button>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => addStavka("DODATNA")}
          >
            + Dodaj dodatnu opremu
          </button>
        </div>

        {err && <div className="alert alert-danger py-2">{err}</div>}

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit">
            Kreiraj iznajmljivanje
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => nav(-1)}
          >
            Nazad
          </button>
        </div>
      </form>
    </div>
  );
}
