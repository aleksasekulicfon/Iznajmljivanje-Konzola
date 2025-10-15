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
import nintendoImg from "../../../assets/nintendo.jpg";
import "./IznajmljivanjeForm.css";

const slike = {
  "PlayStation 5": ps5Img,
  "Xbox Series X": xboxImg,
  "DualSense Controller": dualsenseImg,
  "Xbox Controller": xboxControllerImg,
  "Nintendo Switch": nintendoImg,
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
    <div className="modern-form-wrapper">
      <div className="modern-form-container">
        <h2 className="modern-form-title">🕹️ Novo iznajmljivanje</h2>

        <form onSubmit={onSubmit} className="fade-in">
          <div className="input-block">
            <label>Radnik</label>
            <select
              className="input-modern"
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

          <div className="input-block">
            <label>Klijent</label>
            <select
              className="input-modern"
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

          <h4 className="section-title">🎮 Stavke iznajmljivanja</h4>

          {form.stavke.map((s, index) => (
            <div key={index} className="stavka-card fade-slide">
              <div className="row">
                <div className="col">
                  <label>Tip</label>
                  <input className="input-modern" value={s.tip} disabled />
                </div>

                <div className="col">
                  <label>
                    {s.tip === "KONZOLA" ? "Konzola" : "Dodatna oprema"}
                  </label>
                  <select
                    className="input-modern"
                    value={s.opremaId}
                    onChange={(e) =>
                      onOpremaSelect(index, e.target.value, s.tip)
                    }
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

                <div className="col">
                  <label>Cena (€ / sat)</label>
                  <input
                    className="input-modern"
                    type="number"
                    value={s.cena}
                    readOnly
                  />
                </div>

                <div className="col">
                  <label>Količina</label>
                  <input
                    className="input-modern"
                    type="number"
                    min="1"
                    value={s.kolicina}
                    onChange={(e) =>
                      setStavka(index, "kolicina", e.target.value)
                    }
                  />
                </div>
              </div>

              {s.naziv && slike[s.naziv] && (
                <div className="stavka-img-preview">
                  <img src={slike[s.naziv]} alt={s.naziv} />
                  <span>{s.naziv}</span>
                </div>
              )}

              <button
                type="button"
                className="btn-remove-modern"
                onClick={() => removeStavka(index)}
              >
                🗑️ Ukloni
              </button>
            </div>
          ))}

          <div className="btn-add-row">
            <button
              type="button"
              className="btn-add-modern"
              onClick={() => addStavka("KONZOLA")}
            >
              🎮 Dodaj konzolu
            </button>
            <button
              type="button"
              className="btn-add-modern blue"
              onClick={() => addStavka("DODATNA")}
            >
              🧩 Dodaj dodatnu opremu
            </button>
          </div>

          {err && <div className="error-banner">{err}</div>}

          <div className="form-actions">
            <button className="btn-save-modern" type="submit">
              💾 Kreiraj iznajmljivanje
            </button>
            <button
              type="button"
              className="btn-back-modern"
              onClick={() => nav(-1)}
            >
              ⬅ Nazad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
