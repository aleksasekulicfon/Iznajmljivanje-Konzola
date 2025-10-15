import { useEffect, useState } from "react";
import * as KlijentService from "../../../services/KlijentService";
import { Link } from "react-router-dom";
import "./ListKlijenti.css";

export default function ListKlijenti() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const data = await KlijentService.getAll();
      setItems(data);
    }
    load();
  }, []);

  const filtered = items.filter(
    (k) =>
      k.ime.toLowerCase().includes(search.toLowerCase()) ||
      k.prezime.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="klijenti-container container mt-4 fade-in">
      <div className="header-row">
        <h3>Klijenti</h3>
        <Link className="btn-add" to="/admin/klijenti/new">
          + Novi klijent
        </Link>
      </div>

      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Pretraga po imenu ili prezimenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime i prezime</th>
            <th>Korisničko ime</th>
            <th>Email</th>
            <th>Kredit (€)</th>
            <th className="text-end">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((k) => (
            <tr key={k.id}>
              <td>{k.id}</td>
              <td>{k.ime} {k.prezime}</td>
              <td>{k.korisnickoIme}</td>
              <td>{k.email || "—"}</td>
              <td>{Number(k.kredit || 0).toFixed(2)}</td>
              <td className="text-end">
                <div className="actions">
                  <Link
                    to={`/admin/klijenti/${k.id}`}
                    className="btn-action edit"
                  >
                    ✏️ Izmeni
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="no-data">
                Nema pronađenih klijenata.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
