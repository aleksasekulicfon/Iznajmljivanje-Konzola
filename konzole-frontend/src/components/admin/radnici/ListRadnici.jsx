import { useEffect, useState } from "react";
import * as RadnikService from "../../../services/RadnikService";
import { Link } from "react-router-dom";

export default function ListRadnici() {
  const [items, setItems] = useState([]);

  useEffect(() => { RadnikService.getAll().then(setItems); }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Radnici</h4>
        <Link className="btn btn-primary" to="/admin/radnici/new">+ Novi</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>ID</th><th>Ime</th><th>Prezime</th><th>Korisničko ime</th><th /></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.ime}</td>
                <td>{r.prezime}</td>
                <td>{r.korisnickoIme}</td>
                <td className="text-end">
                  <Link className="btn btn-sm btn-outline-secondary me-2" to={`/admin/radnici/${r.id}`}>Izmeni</Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5}>Nema podataka.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}