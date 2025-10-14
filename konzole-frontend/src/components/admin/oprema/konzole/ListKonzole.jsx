import { useEffect, useState } from "react";
import * as OpremaService from "../../../../services/OpremaService";
import { Link } from "react-router-dom";

export default function ListKonzole() {
  const [items, setItems] = useState([]);
  useEffect(()=>{ OpremaService.listKonzole().then(setItems); }, []);
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Konzole</h4>
        <Link className="btn btn-primary" to="/admin/oprema/konzole/new">+ Nova</Link>
      </div>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Naziv</th><th>Proizvođač</th><th>Cena/sat</th><th>Inventarski br.</th><th /></tr></thead>
        <tbody>
          {items.map(x=>(
            <tr key={x.id}>
              <td>{x.id}</td><td>{x.naziv}</td><td>{x.proizvodjac}</td><td>{x.cena}</td><td>{x.inventarskiBroj}</td>
              <td className="text-end"><Link className="btn btn-sm btn-outline-secondary" to={`/admin/oprema/konzole/${x.id}`}>Izmeni</Link></td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={6}>Nema podataka.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}