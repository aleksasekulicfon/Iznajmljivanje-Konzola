import { useEffect, useState } from "react";
import * as KlijentService from "../../../services/KlijentService";
import { Link } from "react-router-dom";

export default function ListKlijenti() {
  const [items, setItems] = useState([]);
  useEffect(() => { KlijentService.getAll().then(setItems); }, []);
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Klijenti</h4>
        <Link className="btn btn-primary" to="/admin/klijenti/new">+ Novi</Link>
      </div>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Ime</th><th>Prezime</th><th>Korisničko ime</th><th /></tr></thead>
        <tbody>
          {items.map(k => (
            <tr key={k.id}>
              <td>{k.id}</td><td>{k.ime}</td><td>{k.prezime}</td><td>{k.korisnickoIme}</td>
              <td className="text-end"><Link className="btn btn-sm btn-outline-secondary" to={`/admin/klijenti/${k.id}`}>Izmeni</Link></td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={5}>Nema podataka.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}