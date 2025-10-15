import { useEffect, useState } from "react";
import * as OpremaService from "../../../../services/OpremaService";
import { Link } from "react-router-dom";
import "./ListKonzole.css";
import ps5 from "../../../../assets/ps5.jpg";
import xbox from "../../../../assets/xbox.jpg";
import nintendo from "../../../../assets/nintendo.jpg";

export default function ListKonzole() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await OpremaService.listKonzole();
    setItems(data);
  }

  // Izračunaj broj po statusima
  const slobodne = items.filter((x) => x.stanje === "SLOBODNA").length;
  const zauzete = items.filter((x) => x.stanje === "ZAUZETA").length;
  const servis = items.filter((x) => x.stanje === "SERVIS").length;

  // Ukupan broj konzola na stanju
  const ukupnoZaliha = items.reduce((sum, x) => sum + (x.zalihe || 0), 0);

  function formatStanje(stanje) {
    switch (stanje) {
      case "SLOBODNA":
        return <span className="badge status-free">🟢 Slobodna</span>;
      case "ZAUZETA":
        return <span className="badge status-busy">🟡 Zauzeta</span>;
      case "SERVIS":
        return <span className="badge status-service">🔧 Servis</span>;
      default:
        return <span className="badge bg-secondary">{stanje}</span>;
    }
  }

  function formatZalihe(z) {
    if (z <= 3)
      return <span style={{ color: "#d32f2f", fontWeight: "600" }}>{z}</span>; // crveno
    if (z <= 10)
      return <span style={{ color: "#fbc02d", fontWeight: "600" }}>{z}</span>; // žuto
    return <span style={{ color: "#2e7d32", fontWeight: "600" }}>{z}</span>; // zeleno
  }

  function getSlika(naziv) {
    const ime = naziv.toLowerCase();
    if (ime.includes("playstation") || ime.includes("ps5")) return ps5;
    if (ime.includes("xbox")) return xbox;
    if (ime.includes("nintendo")) return nintendo;
    return "https://via.placeholder.com/80?text=Konzola"; // fallback
  }

  return (
    <div className="konzole-container container mt-4 shine-in">
      {/* Header */}
      <div className="header-row">
        <h3>🎮 Konzole</h3>
        <Link className="btn-add" to="/admin/oprema/konzole/new">
          + Nova konzola
        </Link>
      </div>

      {/* Info bar */}
      <div className="summary-bar">
        <div className="summary-item free">🟢 Slobodnih: {slobodne}</div>
        <div className="summary-item busy">🟡 Zauzetih: {zauzete}</div>
        <div className="summary-item service">🔧 Na servisu: {servis}</div>
        <div className="summary-item total">
          🎮 Ukupno konzola: {items.length}
        </div>
        <div className="summary-item total">
          📦 Ukupno na stanju: {ukupnoZaliha}
        </div>
      </div>

      {/* Tabela */}
      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Slika</th>
              <th>ID</th>
              <th>Naziv</th>
              <th>Proizvođač</th>
              <th>Cena / sat (€)</th>
              <th>Zalihe</th>
              <th>Stanje</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((x, i) => (
              <tr key={x.id} style={{ "--i": i }}>
                <td>
                  <img
                    src={getSlika(x.naziv)}
                    alt={x.naziv}
                    className="console-img"
                  />
                </td>
                <td>{x.id}</td>
                <td>{x.naziv}</td>
                <td>{x.proizvodjac}</td>
                <td>{Number(x.cena).toFixed(2)}</td>
                <td>{formatZalihe(x.zalihe)}</td>
                <td>{formatStanje(x.stanje)}</td>
                <td className="text-end">
                  <Link
                    className="btn-edit"
                    to={`/admin/oprema/konzole/${x.id}`}
                  >
                    ✏️ Izmeni
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="no-data">
                  Nema podataka o konzolama.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
