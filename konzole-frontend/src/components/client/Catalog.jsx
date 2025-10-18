import { useEffect, useState } from "react";
import * as OpremaService from "../../services/OpremaService";
import { getConsoleImage } from "../../utils/images";
import "./Catalog.css";

export default function Catalog() {
  const [konzole, setKonzole] = useState([]);
  const [dodatna, setDodatna] = useState([]);

  useEffect(() => {
    OpremaService.listKonzole().then(setKonzole);
    OpremaService.listDodatna().then(setDodatna);
  }, []);

  function getStatusClass(stanje) {
    switch (stanje) {
      case "SLOBODNA":
        return "status-free";
      case "ZAUZETA":
        return "status-busy";
      case "SERVIS":
        return "status-service";
      default:
        return "";
    }
  }

  return (
    <div className="catalog-page">
      <h2>🎮 Katalog konzola</h2>

      <div className="catalog-grid">
        {konzole.map((k) => {
          const imgSrc = getConsoleImage(k.slikaUrl || k.naziv || k.model, "konzole");
          return (
            <div className="catalog-card" key={k.id}>
              <img src={imgSrc} alt={k.naziv} className="catalog-img" />
              <h3>{k.naziv}</h3>
              <p className="subtext">{k.proizvodjac}</p>

              <p className="price">{k.cena} RSD / sat</p>

              <div className={`status ${getStatusClass(k.stanje)}`}>{k.stanje}</div>
              <div className="stock">
                <span>📦 Zalihe:</span> <b>{k.zalihe ?? 0}</b>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="section-title">🎧 Dodatna oprema</h2>

      <div className="catalog-grid">
        {dodatna.map((d) => {
          const imgSrc = getConsoleImage(d.slikaUrl || d.naziv || d.tip, "dodatna");
          return (
            <div className="catalog-card" key={d.id}>
              <img src={imgSrc} alt={d.naziv} className="catalog-img" />
              <h3>{d.naziv}</h3>
              <p className="subtext">{d.tip}</p>

              <p className="price">{d.cena} RSD / sat</p>

              <div className={`status ${getStatusClass(d.stanje)}`}>{d.stanje}</div>
              <div className="stock">
                <span>📦 Zalihe:</span> <b>{d.zalihe ?? 0}</b>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}