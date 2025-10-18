import { useEffect, useState } from "react";
import * as KlijentService from "../../../services/KlijentService";
import * as MestoService from "../../../services/MestoService"; // 🔹 dodato
import { Link } from "react-router-dom";
import "./ListKlijenti.css";

export default function ListKlijenti() {
  const [items, setItems] = useState([]);
  const [mesta, setMesta] = useState([]);

  // Filter polja
  const [search, setSearch] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterMesto, setFilterMesto] = useState("");

  // Učitavanje podataka
  useEffect(() => {
    async function load() {
      try {
        const [klijentiData, mestaData] = await Promise.all([
          KlijentService.getAll(),
          MestoService.list(),
        ]);
        setItems(klijentiData);
        setMesta(mestaData);
      } catch (err) {
        console.error("Greška prilikom učitavanja klijenata ili mesta:", err);
      }
    }
    load();
  }, []);

  // Brisanje klijenta
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite da obrišete ovog klijenta?"
    );
    if (!confirmDelete) return;

    try {
      await KlijentService.remove(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      alert("✅ Sistem je obrisao klijenta!");
    } catch (err) {
      console.error("Greška prilikom brisanja klijenta:", err);
      alert("❌ Došlo je do greške prilikom brisanja klijenta.");
    }
  }

  // Filtriranje
  const filtered = items.filter((k) => {
    const matchImePrezime =
      k.ime.toLowerCase().includes(search.toLowerCase()) ||
      k.prezime.toLowerCase().includes(search.toLowerCase());
    const matchUsername = k.korisnickoIme
      .toLowerCase()
      .includes(filterUsername.toLowerCase());
    const matchEmail = (k.email || "")
      .toLowerCase()
      .includes(filterEmail.toLowerCase());
    const matchMesto = filterMesto
      ? String(k.mestoId) === String(filterMesto)
      : true;

    return matchImePrezime && matchUsername && matchEmail && matchMesto;
  });

  return (
    <div className="klijenti-container container mt-4 fade-in">
      <div className="header-row">
        <h3>Klijenti</h3>
        <Link className="btn-add" to="/admin/klijenti/new">
          + Novi klijent
        </Link>
      </div>

      {/* 🔍 Filteri */}
      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Ime ili prezime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="👤 Korisničko ime..."
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="📧 Email..."
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />

        <select
          value={filterMesto}
          onChange={(e) => setFilterMesto(e.target.value)}
        >
          <option value="">🌍 Sva mesta</option>
          {mesta.map((m) => (
            <option key={m.id} value={m.id}>
              {m.naziv}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Tabela */}
      <table className="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime i prezime</th>
            <th>Korisničko ime</th>
            <th>Email</th>
            <th>Mesto</th>
            <th>Kredit (€)</th>
            <th className="text-end">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((k) => {
            const mestoNaziv =
              mesta.find((m) => m.id === k.mestoId)?.naziv || "—";
            return (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td>
                  {k.ime} {k.prezime}
                </td>
                <td>{k.korisnickoIme}</td>
                <td>{k.email || "—"}</td>
                <td>{mestoNaziv}</td>
                <td>{Number(k.kredit || 0).toFixed(2)}</td>
                <td className="text-end">
                  <div className="actions">
                    <Link
                      to={`/admin/klijenti/${k.id}`}
                      className="btn-action edit"
                    >
                      ✏️ Izmeni
                    </Link>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="btn-action delete"
                    >
                      🗑️ Obriši
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="no-data">
                Nema pronađenih klijenata.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}