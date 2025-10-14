import { useEffect, useState } from "react";
import * as IznService from "../../../services/IznajmljivanjeService";
import * as KlijentService from "../../../services/KlijentService";
import { Link } from "react-router-dom";
import "./ListIznajmljivanja.css";

export default function ListIznajmljivanja() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [klijenti, setKlijenti] = useState({});

  const [filters, setFilters] = useState({
    ime: "",
    id: "",
    status: "",
    datum: "",
    iznosOd: "",
    iznosDo: "",
  });

  useEffect(() => {
    async function loadData() {
      const data = await IznService.list();
      setItems(data);
      setFiltered(data);

      const klijentiData = {};
      for (const i of data) {
        if (i.klijentId && !klijentiData[i.klijentId]) {
          try {
            const k = await KlijentService.getById(i.klijentId);
            klijentiData[i.klijentId] = `${k.ime} ${k.prezime}`;
          } catch {
            klijentiData[i.klijentId] = "Nepoznat klijent";
          }
        }
      }
      setKlijenti(klijentiData);
    }
    loadData();
  }, []);

  useEffect(() => {
    let data = [...items];
    if (filters.ime)
      data = data.filter((x) =>
        (klijenti[x.klijentId] || "").toLowerCase().includes(filters.ime.toLowerCase())
      );
    if (filters.id)
      data = data.filter((x) => String(x.id).includes(filters.id));
    if (filters.status)
      data = data.filter((x) => x.status === filters.status);
    if (filters.datum)
      data = data.filter((x) => x.pocetak?.startsWith(filters.datum));
    if (filters.iznosOd)
      data = data.filter((x) => Number(x.ukupanIznos) >= Number(filters.iznosOd));
    if (filters.iznosDo)
      data = data.filter((x) => Number(x.ukupanIznos) <= Number(filters.iznosDo));

    setFiltered(data);
  }, [filters, items, klijenti]);

  function formatDateTime(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(
      d.getHours()
    )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function formatStatus(status) {
    switch (status) {
      case "U_TOKU":
        return <span className="badge status-active">U TOKU</span>;
      case "ZAVRSENO":
        return <span className="badge status-finished">ZAVRŠENO</span>;
      case "OTKAZANO":
        return <span className="badge status-cancelled">OTKAZANO</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  }

  function resetFilters() {
    setFilters({
      ime: "",
      id: "",
      status: "",
      datum: "",
      iznosOd: "",
      iznosDo: "",
    });
  }

  return (
    <div className="iznajmljivanja-container container mt-4">
      <div className="header-row">
        <h3>Iznajmljivanja</h3>
        <Link className="btn-add" to="/admin/iznajmljivanja/new">
          + Novo
        </Link>
      </div>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="Pretraga po imenu klijenta..."
          value={filters.ime}
          onChange={(e) => setFilters({ ...filters, ime: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID..."
          value={filters.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
        />
        <input
          type="date"
          value={filters.datum}
          onChange={(e) => setFilters({ ...filters, datum: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="U_TOKU">U TOKU</option>
          <option value="ZAVRSENO">ZAVRŠENO</option>
          <option value="OTKAZANO">OTKAZANO</option>
        </select>
        <input
          type="number"
          placeholder="Iznos od (€)"
          value={filters.iznosOd}
          onChange={(e) => setFilters({ ...filters, iznosOd: e.target.value })}
        />
        <input
          type="number"
          placeholder="Iznos do (€)"
          value={filters.iznosDo}
          onChange={(e) => setFilters({ ...filters, iznosDo: e.target.value })}
        />
        <button className="btn-reset" onClick={resetFilters}>
          Resetuj
        </button>
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Klijent</th>
            <th>Početak</th>
            <th>Status</th>
            <th>Iznos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((x) => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>{klijenti[x.klijentId] || "..."}</td>
              <td>{formatDateTime(x.pocetak)}</td>
              <td>{formatStatus(x.status)}</td>
              <td>{Number(x.ukupanIznos).toFixed(2)} €</td>
              <td className="text-end">
                <div className="actions">
                  <Link className="btn-detail" to={`/admin/iznajmljivanja/${x.id}`}>
                    🔍 Detalji
                  </Link>
                  <Link className="btn-edit" to={`/admin/iznajmljivanja/edit/${x.id}`}>
                    ✏️ Izmeni
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="no-data">
                Nema podataka.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}