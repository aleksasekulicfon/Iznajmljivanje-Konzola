import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as IznService from "../../../services/IznajmljivanjeService";
import * as KlijentService from "../../../services/KlijentService";
import * as OpremaService from "../../../services/OpremaService";

import ps5Img from "../../../assets/ps5.jpg";
import xboxImg from "../../../assets/xbox.jpg";
import dualsenseImg from "../../../assets/dualsensecontroller.jpg";
import xboxControllerImg from "../../../assets/xboxcontroller.jpeg";
import nintendoImg from "../../../assets/nintendo.jpg";

import "./IznajmljivanjeDetalj.css";

const slike = {
  "PlayStation 5": ps5Img,
  "Xbox Series X": xboxImg,
  "DualSense Controller": dualsenseImg,
  "Xbox Controller": xboxControllerImg,
  "Nintendo Switch": nintendoImg,
};

export default function IznajmljivanjeDetalj() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [klijent, setKlijent] = useState(null);
  const [konzole, setKonzole] = useState([]);
  const [dodatnaOprema, setDodatnaOprema] = useState([]);
  const [err, setErr] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // 🕓 Formatiranje vremena
  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}.${pad(
      date.getMonth() + 1
    )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
      date.getMinutes()
    )}:${pad(date.getSeconds())}`;
  }

  // 📦 Učitavanje podataka
  useEffect(() => {
    async function load() {
      try {
        const data = await IznService.get(id);
        setItem(data);
        if (data.klijentId) {
          const k = await KlijentService.getById(data.klijentId);
          setKlijent(k);
        }
        const [kon, dop] = await Promise.all([
          OpremaService.listKonzole(),
          OpremaService.listDodatna(),
        ]);
        setKonzole(kon);
        setDodatnaOprema(dop);
      } catch {
        setErr("Greška pri učitavanju detalja.");
      }
    }
    load();
  }, [id]);

  // 🕒 Tajmer i progress bar
  useEffect(() => {
    if (!item || !item.pocetak || item.kraj || item.status === "OTKAZANO")
      return;

    const updateElapsed = () => {
      const start = new Date(item.pocetak);
      const now = new Date();
      const diffMs = now - start;
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const format = (n) => String(n).padStart(2, "0");
      setElapsedTime(`${format(hours)}:${format(minutes)}:${format(seconds)}`);

      const maxDurationHours = 8;
      const progressValue = Math.min(
        (hours + minutes / 60 + seconds / 3600) / maxDurationHours,
        1
      );
      setProgress(progressValue);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [item]);

  async function zavrsi() {
    setErr("");
    try {
      const res = await IznService.finish(id);
      setItem(res);
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri završavanju.");
    }
  }

  async function sacuvajIzmene() {
    setErr("");
    try {
      const payload = {
        ...item,
        status: item.status,
        kraj: item.kraj || null,
        stavke: item.stavke.map((s, i) => ({
          rb: i + 1,
          opremaId: s.opremaId,
          kolicina: Number(s.kolicina || 1),
          cena: Number(s.cena || 0),
        })),
      };
      delete payload.ukupanIznos;
      delete payload.placeno;
      delete payload.pocetak;

      const res = await IznService.update(item.id, payload);
      setItem(res);
      setIsEditing(false);

      if (res.status === "OTKAZANO") {
        setProgress(0);
        setElapsedTime("00:00:00");
      }
    } catch (e) {
      setErr("Greška pri ažuriranju iznajmljivanja.");
    }
  }

  // ➕ Dodavanje stavke
  function addStavka(tip) {
    setItem({
      ...item,
      stavke: [
        ...(item.stavke || []),
        { tip, opremaId: "", cena: 0, kolicina: 1, ukupnoVreme: 0, iznos: 0 },
      ],
    });
  }

  // ❌ Uklanjanje stavke
  function removeStavka(index) {
    const updated = [...item.stavke];
    updated.splice(index, 1);
    setItem({ ...item, stavke: updated });
  }

  function onOpremaSelect(index, id) {
    const selectedId = Number(id);
    const izabranaKonzola = konzole.find((o) => o.id === selectedId);
    const izabranaDodatna = dodatnaOprema.find((o) => o.id === selectedId);

    const updated = [...item.stavke];

    if (izabranaKonzola) {
      updated[index] = {
        ...updated[index],
        tip: "KONZOLA",
        opremaId: izabranaKonzola.id,
        cena: izabranaKonzola.cenaPoSatu || izabranaKonzola.cena,
      };
    } else if (izabranaDodatna) {
      updated[index] = {
        ...updated[index],
        tip: "DODATNA",
        opremaId: izabranaDodatna.id,
        cena: izabranaDodatna.cenaPoSatu || izabranaDodatna.cena,
      };
    } else {
      updated[index] = { ...updated[index], opremaId: "", tip: "", cena: 0 };
    }

    setItem({ ...item, stavke: updated });
  }

  if (!item) return <div className="loader-container">Učitavanje...</div>;

  return (
    <div className="iznajmljivanje-container">
      <div className="header-section">
        <h2>Iznajmljivanje #{item.id}</h2>
        <p className="status">
          <span className={`status-badge ${item.status.toLowerCase()}`}>
            {item.status}
          </span>
        </p>
        {item.status !== "ZAVRSENO" && (
          <button
            className="btn-edit"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "❌ Otkaži" : "✏️ Izmeni"}
          </button>
        )}
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span className="label">Klijent</span>
          <p>
            {klijent ? `${klijent.ime} ${klijent.prezime}` : "Učitavanje..."}
          </p>
        </div>

        <div className="info-card">
          <span className="label">Početak</span>
          <p>{formatDateTime(item.pocetak)}</p>
        </div>

        <div className="info-card">
          <span className="label">Kraj</span>
          {isEditing ? (
            <input
              type="datetime-local"
              value={
                item.kraj ? new Date(item.kraj).toISOString().slice(0, 16) : ""
              }
              onChange={(e) =>
                setItem({
                  ...item,
                  kraj: new Date(e.target.value).toISOString(),
                })
              }
            />
          ) : (
            <p>{item.kraj ? formatDateTime(item.kraj) : "-"}</p>
          )}
        </div>

        <div className="info-card">
          <span className="label">Status</span>
          {isEditing ? (
            <select
              value={item.status}
              onChange={(e) => setItem({ ...item, status: e.target.value })}
            >
              <option value="U_TOKU">U TOKU</option>
              <option value="ZAVRSENO">ZAVRŠENO</option>
              <option value="OTKAZANO">OTKAZANO</option>
            </select>
          ) : (
            <p>{item.status}</p>
          )}
        </div>

        <div className="info-card">
          <span className="label">Ukupan iznos</span>
          <p className="highlight">{Number(item.ukupanIznos).toFixed(2)} €</p>
        </div>
      </div>

      {item.status === "U_TOKU" && (
        <div className="timer-card">
          <p>⏱ Vreme iznajmljivanja:</p>
          <h4>{elapsedTime}</h4>
          <div className="timer-progress-container">
            <div
              className="timer-progress-bar"
              style={{
                width: `${progress * 100}%`,
                background:
                  progress < 0.5
                    ? "#00b871"
                    : progress < 0.8
                    ? "#ffb400"
                    : "#ff4d4d",
              }}
            ></div>
          </div>
        </div>
      )}

      <h4 className="mt-4 mb-3 text-center">🎮 Stavke iznajmljivanja</h4>

      {isEditing && (
        <div className="edit-stavke">
          {(item.stavke || []).map((s, i) => {
            const naziv =
              konzole.find((o) => o.id === s.opremaId)?.naziv ||
              dodatnaOprema.find((o) => o.id === s.opremaId)?.naziv ||
              "";
            const slika = slike[naziv];

            return (
              <div key={i} className="stavka-edit-row-modern">
                {slika && (
                  <img src={slika} alt={naziv} className="stavka-mini-img" />
                )}

                <select
                  value={s.opremaId || ""}
                  onChange={(e) => {
                    const selected = (
                      s.tip === "KONZOLA" ? konzole : dodatnaOprema
                    ).find((o) => o.id === Number(e.target.value));

                    const updated = [...item.stavke];
                    updated[i] = {
                      ...updated[i],
                      opremaId: Number(e.target.value),
                      cena: selected ? selected.cena : 0,
                    };
                    setItem({ ...item, stavke: updated });
                  }}
                >
                  <option value="">Izaberi opremu...</option>
                  {(s.tip === "KONZOLA" ? konzole : dodatnaOprema).map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.naziv}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Cena (€ / sat)"
                  value={s.cena}
                  readOnly
                />

                <input
                  type="number"
                  placeholder="Količina"
                  min="1"
                  value={s.kolicina}
                  onChange={(e) => {
                    const updated = [...item.stavke];
                    updated[i].kolicina = Number(e.target.value);
                    setItem({ ...item, stavke: updated });
                  }}
                />

                <button className="btn-remove" onClick={() => removeStavka(i)}>
                  ❌ Ukloni
                </button>
              </div>
            );
          })}

          <div className="btn-row-add-modern">
            <button
              className="btn-add-modern"
              onClick={() => addStavka("KONZOLA")}
            >
              🎮 Dodaj konzolu
            </button>
            <button
              className="btn-add-modern"
              onClick={() => addStavka("DODATNA")}
            >
              🧩 Dodaj dodatnu opremu
            </button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="stavke-grid">
          {(item.stavke || []).map((s, i) => {
            const naziv = s.naziv || s.opremaNaziv || `Oprema ${s.opremaId}`;
            const slika = slike[naziv];
            return (
              <div className="stavka-card" key={i}>
                {slika && (
                  <img src={slika} alt={naziv} className="stavka-img" />
                )}
                <h5>{naziv}</h5>
                <p className="price">
                  {Number(s.cena).toFixed(2)} € <span>/ sat</span>
                </p>
                <p>Količina: {s.kolicina}</p>
                <p>Vreme: {s.ukupnoVreme || 0} h</p>
                <p className="highlight">
                  Iznos: {Number(s.iznos).toFixed(2)} €
                </p>
              </div>
            );
          })}
        </div>
      )}

      {err && <div className="alert-error">{err}</div>}

      <div className="button-row">
        {isEditing ? (
          <button className="btn-primary" onClick={sacuvajIzmene}>
            💾 Sačuvaj izmene
          </button>
        ) : (
          item.status === "U_TOKU" && (
            <button className="btn-primary" onClick={zavrsi}>
              ✅ Završi
            </button>
          )
        )}
        <button
          className="btn-secondary"
          onClick={() => nav("/admin/iznajmljivanja")}
        >
          ⬅ Nazad
        </button>
      </div>
    </div>
  );
}
