import { useEffect, useState } from "react";
import * as RadnikService from "../../../services/RadnikService";
import { Link } from "react-router-dom";
import "./ListRadnici.css";

export default function ListRadnici() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const data = await RadnikService.getAll();
      setItems(data);
    }
    load();
  }, []);

  const filtered = items.filter(
    (r) =>
      r.ime.toLowerCase().includes(search.toLowerCase()) ||
      r.prezime.toLowerCase().includes(search.toLowerCase()) ||
      r.korisnickoIme.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="radnici-container container mt-4 fade-in">
      <div className="header-row">
        <h3>👨‍💼 Radnici</h3>
        <Link className="btn-add" to="/admin/radnici/new">
          + Novi radnik
        </Link>
      </div>

      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Pretraga po imenu, prezimenu ili korisničkom imenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ime i Prezime</th>
              <th>Korisničko ime</th>
              <th>Uloga</th>
              <th className="text-end">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ "--i": i }}>
                <td>{r.id}</td>
                <td>{r.ime} {r.prezime}</td>
                <td>{r.korisnickoIme}</td>
                <td>{r.uloga || "Zaposleni"}</td>
                <td className="text-end">
                  <div className="actions">
                    <Link
                      className="btn-action edit"
                      to={`/admin/radnici/${r.id}`}
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
                  Nema pronađenih radnika.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}