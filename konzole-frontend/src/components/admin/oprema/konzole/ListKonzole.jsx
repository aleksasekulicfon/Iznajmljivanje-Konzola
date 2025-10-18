import { useEffect, useState } from "react";
import * as OpremaService from "../../../../services/OpremaService";
import { Link } from "react-router-dom";
import "./ListKonzole.css";
import ps5 from "../../../../assets/ps5.jpg";
import xbox from "../../../../assets/xbox.jpg";
import nintendo from "../../../../assets/nintendo.jpg";

export default function ListKonzole() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    naziv: "",
    proizvodjac: "",
    cenaOd: "",
    cenaDo: "",
    zaliheOd: "",
    zaliheDo: "",
    stanje: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await OpremaService.listKonzole();
    setItems(data);
    setFiltered(data);
  }

  async function obrisiKonzolu(id) {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu konzolu?")) {
      try {
        await OpremaService.removeKonzola(id);
        alert("Sistem je obrisao konzolu!");
        setItems((prev) => prev.filter((x) => x.id !== id));
        setFiltered((prev) => prev.filter((x) => x.id !== id));
      } catch (err) {
        alert("Greška pri brisanju konzole.");
        console.error(err);
      }
    }
  }

  // 🔍 Filter logika
  useEffect(() => {
    let data = items.filter((x) => {
      const naziv = x.naziv.toLowerCase();
      const proizvodjac = x.proizvodjac?.toLowerCase() || "";

      return (
        naziv.includes(filters.naziv.toLowerCase()) &&
        proizvodjac.includes(filters.proizvodjac.toLowerCase()) &&
        (filters.stanje ? x.stanje === filters.stanje : true) &&
        (filters.cenaOd ? x.cena >= parseFloat(filters.cenaOd) : true) &&
        (filters.cenaDo ? x.cena <= parseFloat(filters.cenaDo) : true) &&
        (filters.zaliheOd ? x.zalihe >= parseInt(filters.zaliheOd) : true) &&
        (filters.zaliheDo ? x.zalihe <= parseInt(filters.zaliheDo) : true)
      );
    });
    setFiltered(data);
  }, [filters, items]);

  const slobodne = filtered.filter((x) => x.stanje === "SLOBODNA").length;
  const zauzete = filtered.filter((x) => x.stanje === "ZAUZETA").length;
  const servis = filtered.filter((x) => x.stanje === "SERVIS").length;
  const ukupnoZaliha = filtered.reduce((sum, x) => sum + (x.zalihe || 0), 0);

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
      return <span style={{ color: "#d32f2f", fontWeight: "600" }}>{z}</span>;
    if (z <= 10)
      return <span style={{ color: "#fbc02d", fontWeight: "600" }}>{z}</span>;
    return <span style={{ color: "#2e7d32", fontWeight: "600" }}>{z}</span>;
  }

  function getSlika(naziv) {
    const ime = naziv.toLowerCase();
    if (ime.includes("playstation") || ime.includes("ps5")) return ps5;
    if (ime.includes("xbox")) return xbox;
    if (ime.includes("nintendo")) return nintendo;
    return "https://via.placeholder.com/80?text=Konzola";
  }

  return (
    <div className="konzole-container container mt-4 shine-in">
      <div className="header-row">
        <h3>🎮 Konzole</h3>
        <Link className="btn-add" to="/admin/oprema/konzole/new">
          + Nova konzola
        </Link>
      </div>

      {/* 🔽 FILTER SEKCIJA */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Naziv..."
          value={filters.naziv}
          onChange={(e) => setFilters({ ...filters, naziv: e.target.value })}
        />
        <input
          type="text"
          placeholder="🏭 Proizvođač..."
          value={filters.proizvodjac}
          onChange={(e) => setFilters({ ...filters, proizvodjac: e.target.value })}
        />
        <input
          type="number"
          placeholder="€ Cena od"
          value={filters.cenaOd}
          onChange={(e) => setFilters({ ...filters, cenaOd: e.target.value })}
        />
        <input
          type="number"
          placeholder="€ Cena do"
          value={filters.cenaDo}
          onChange={(e) => setFilters({ ...filters, cenaDo: e.target.value })}
        />
        <input
          type="number"
          placeholder="📦 Zalihe od"
          value={filters.zaliheOd}
          onChange={(e) => setFilters({ ...filters, zaliheOd: e.target.value })}
        />
        <input
          type="number"
          placeholder="📦 Zalihe do"
          value={filters.zaliheDo}
          onChange={(e) => setFilters({ ...filters, zaliheDo: e.target.value })}
        />
        <select
          value={filters.stanje}
          onChange={(e) => setFilters({ ...filters, stanje: e.target.value })}
        >
          <option value="">Sva stanja</option>
          <option value="SLOBODNA">Slobodna</option>
          <option value="ZAUZETA">Zauzeta</option>
          <option value="SERVIS">Servis</option>
        </select>
      </div>

      {/* Statistika */}
      <div className="summary-bar">
        <div className="summary-item free">🟢 Slobodnih: {slobodne}</div>
        <div className="summary-item busy">🟡 Zauzetih: {zauzete}</div>
        <div className="summary-item service">🔧 Na servisu: {servis}</div>
        <div className="summary-item total">🎮 Ukupno: {filtered.length}</div>
        <div className="summary-item total">📦 Na stanju: {ukupnoZaliha}</div>
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
            {filtered.map((x, i) => (
              <tr key={x.id} style={{ "--i": i }}>
                <td>
                  <img src={getSlika(x.naziv)} alt={x.naziv} className="console-img" />
                </td>
                <td>{x.id}</td>
                <td>{x.naziv}</td>
                <td>{x.proizvodjac}</td>
                <td>{Number(x.cena).toFixed(2)}</td>
                <td>{formatZalihe(x.zalihe)}</td>
                <td>{formatStanje(x.stanje)}</td>
                <td className="text-end">
                  <Link className="btn-edit" to={`/admin/oprema/konzole/${x.id}`}>
                    ✏️ Izmeni
                  </Link>
                  <button className="btn-delete" onClick={() => obrisiKonzolu(x.id)}>
                    🗑️ Obriši
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="no-data">
                  Nema rezultata za zadate filtere.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}