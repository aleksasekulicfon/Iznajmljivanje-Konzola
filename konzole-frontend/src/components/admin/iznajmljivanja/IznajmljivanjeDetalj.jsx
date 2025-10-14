import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as IznService from "../../../services/IznajmljivanjeService";
import * as KlijentService from "../../../services/KlijentService";

import ps5Img from "../../../assets/ps5.jpg";
import xboxImg from "../../../assets/xbox.jpg";
import dualsenseImg from "../../../assets/dualsensecontroller.jpg";
import xboxControllerImg from "../../../assets/xboxcontroller.jpeg";

import "./IznajmljivanjeDetalj.css"; // 👈 obavezno ubaci css dole

const slike = {
  "PlayStation 5": ps5Img,
  "Xbox Series X": xboxImg,
  "DualSense Controller": dualsenseImg,
  "Xbox Controller": xboxControllerImg,
};

export default function IznajmljivanjeDetalj() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [klijent, setKlijent] = useState(null);
  const [err, setErr] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}.${pad(
      date.getMonth() + 1
    )}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
      date.getMinutes()
    )}:${pad(date.getSeconds())}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await IznService.get(id);
        setItem(data);
        if (data.klijentId) {
          const k = await KlijentService.getById(data.klijentId);
          setKlijent(k);
        }
      } catch {
        setErr("Greška pri učitavanju detalja.");
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!item || !item.pocetak || item.kraj) return;
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
          <p>{item.kraj ? formatDateTime(item.kraj) : "-"}</p>
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
        </div>
      )}

      <h4 className="mt-4 mb-3 text-center">🎮 Stavke iznajmljivanja</h4>

      <div className="stavke-grid">
        {(item.stavke || []).map((s, i) => {
          const naziv = s.naziv || s.opremaNaziv || `Oprema ${s.opremaId}`;
          const slika = slike[naziv];
          return (
            <div className="stavka-card" key={i}>
              {slika && <img src={slika} alt={naziv} className="stavka-img" />}
              <h5>{naziv}</h5>
              <p className="price">
                {Number(s.cena).toFixed(2)} € <span>/ sat</span>
              </p>
              <p>Količina: {s.kolicina}</p>
              <p>Vreme: {s.ukupnoVreme || 0} h</p>
              <p className="highlight">Iznos: {Number(s.iznos).toFixed(2)} €</p>
            </div>
          );
        })}

        {(!item.stavke || item.stavke.length === 0) && (
          <p className="text-muted">Nema stavki.</p>
        )}
      </div>

      {err && <div className="alert-error">{err}</div>}

      <div className="button-row">
        {item.status === "U_TOKU" && (
          <button className="btn-primary" onClick={zavrsi}>
            ✅ Završi
          </button>
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
