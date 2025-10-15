import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as OpremaService from "../../../../services/OpremaService";
import "./ListDodatnaOprema.css";

import dualsenseImg from "../../../../assets/dualsensecontroller.jpg";
import xboxControllerImg from "../../../../assets/xboxcontroller.jpeg";

const slike = {
  "DualSense Controller": dualsenseImg,
  "Xbox Controller": xboxControllerImg,
};

export default function ListDodatnaOprema() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await OpremaService.listDodatna();
    setItems(data);
  }

  async function handleDelete(id) {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu opremu?"))
      return;
    try {
      await OpremaService.removeDodatna(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Greška pri brisanju opreme.");
    }
  }

  // 📊 Statistika
  const slobodne = items.filter((x) => x.stanje === "SLOBODNA").length;
  const zauzete = items.filter((x) => x.stanje === "ZAUZETA").length;
  const servis = items.filter((x) => x.stanje === "SERVIS").length;
  const ukupnoZaliha = items.reduce((sum, x) => sum + (x.zalihe || 0), 0);

  const formatStanje = (stanje) => {
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
  };

  const formatZalihe = (z) => {
    if (z <= 3)
      return <span style={{ color: "#d32f2f", fontWeight: 600 }}>{z}</span>;
    if (z <= 10)
      return <span style={{ color: "#fbc02d", fontWeight: 600 }}>{z}</span>;
    return <span style={{ color: "#2e7d32", fontWeight: 600 }}>{z}</span>;
  };

  return (
    <div className="oprema-container container mt-4 shine-in">
      <div className="header-row">
        <h3>🧩 Dodatna oprema</h3>
        <Link className="btn-add" to="/admin/oprema/dodatna/new">
          + Nova oprema
        </Link>
      </div>

      {/* 📈 Info bar */}
      <div className="summary-bar">
        <div className="summary-item free">🟢 Slobodnih: {slobodne}</div>
        <div className="summary-item busy">🟡 Zauzetih: {zauzete}</div>
        <div className="summary-item service">🔧 Na servisu: {servis}</div>
        <div className="summary-item total">🧩 Ukupno: {items.length}</div>
        <div className="summary-item total">📦 Na stanju: {ukupnoZaliha}</div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>SLIKA</th>
              <th>ID</th>
              <th>NAZIV</th>
              <th>PROIZVOĐAČ</th>
              <th>CENA / SAT (€)</th>
              <th>ZALIHE</th>
              <th>STANJE</th>
              <th>AKCIJE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x, i) => {
              const slika = slike[x.naziv] || null;
              return (
                <tr key={x.id} style={{ "--i": i }}>
                  <td>
                    {slika ? (
                      <div className="item-img-container">
                        <img src={slika} alt={x.naziv} className="item-img" />
                        <div className="item-tooltip">{x.naziv}</div>
                      </div>
                    ) : (
                      <div className="no-img">📦</div>
                    )}
                  </td>

                  <td>{x.id}</td>
                  <td>{x.naziv}</td>
                  <td>{x.proizvodjac}</td>
                  <td>{Number(x.cena).toFixed(2)}</td>
                  <td>{formatZalihe(x.zalihe)}</td>
                  <td>{formatStanje(x.stanje)}</td>
                  <td className="text-end">
                    <div className="action-buttons">
                      <Link
                        className="btn-edit"
                        to={`/admin/oprema/dodatna/${x.id}`}
                      >
                        ✏️ Izmeni
                      </Link>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(x.id)}
                      >
                        🗑️ Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="no-data">
                  Nema dodatne opreme na stanju.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}