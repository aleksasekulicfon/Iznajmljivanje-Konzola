import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as IznService from "../../services/IznajmljivanjeService";
import * as KlijentService from "../../services/KlijentService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyRentals.css";

export default function MyRentals() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const nav = useNavigate();
  const [filters, setFilters] = useState({
    od: "",
    do: "",
    status: "",
    placeno: "",
  });
  const [kredit, setKredit] = useState(0);
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    async function loadData() {
      try {
        const [iznajmljivanja, klijenti] = await Promise.all([
          IznService.list(),
          KlijentService.getAll(),
        ]);

        const klijent = klijenti.find((k) => k.id === user.id);
        if (!klijent) return;

        setKredit(klijent.kredit || 0);

        const mojaIznajmljivanja = iznajmljivanja.filter(
          (x) => x.klijentId === klijent.id
        );

        setItems(mojaIznajmljivanja);
        setFiltered(mojaIznajmljivanja);
      } catch (err) {
        console.error("Greška prilikom učitavanja:", err);
      }
    }

    loadData();
  }, [user?.id]);

  // 🔍 Filtriranje
  useEffect(() => {
    let f = [...items];
    if (filters.od)
      f = f.filter((x) => new Date(x.pocetak) >= new Date(filters.od));
    if (filters.do)
      f = f.filter((x) => new Date(x.kraj) <= new Date(filters.do));
    if (filters.status) f = f.filter((x) => x.status === filters.status);
    if (filters.placeno)
      f = f.filter((x) =>
        filters.placeno === "PLACENO" ? x.placeno : !x.placeno
      );
    setFiltered(f);
  }, [filters, items]);

  // 💳 Nova logika plaćanja (identična kao u RentalDetail.jsx)
  async function handlePlati(id, iznos) {
    try {
      const klijent = await KlijentService.getById(user.id);
      if (!klijent) {
        setMsg("❌ Klijent nije pronađen.");
        return;
      }

      if (klijent.kredit < iznos) {
        setMsg("❌ Nedovoljno kredita za plaćanje.");
        return;
      }

      await IznService.plati(id);

      const noviKredit = klijent.kredit - iznos;
      await KlijentService.update(klijent.id, {
        ...klijent,
        kredit: noviKredit,
      });

      setKredit(noviKredit);
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, placeno: true } : x))
      );

      setMsg("✅ Uspešno ste platili iznajmljivanje!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Greška prilikom plaćanja.");
    }
  }

  function resetFilters() {
    setFilters({ od: "", do: "", status: "", placeno: "" });
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${pad(d.getDate())}.${pad(
      d.getMonth() + 1
    )}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds()
    )}`;
  }

  return (
    <motion.div
      className="rentals-page"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="rentals-header">
        <h2>🎮 Moja iznajmljivanja</h2>
        <div className="kredit-box">
          💰 Kredit: <span>{kredit.toFixed(2)} EUR</span>
        </div>
      </div>

      {msg && <div className="rentals-msg">{msg}</div>}

      {/* 🔍 FILTERI */}
      <motion.div
        className="filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="datetime-local"
          value={filters.od}
          onChange={(e) => setFilters({ ...filters, od: e.target.value })}
        />
        <input
          type="datetime-local"
          value={filters.do}
          onChange={(e) => setFilters({ ...filters, do: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="U_TOKU">U toku</option>
          <option value="ZAVRSENO">Završeno</option>
          <option value="OTKAZANO">Otkazano</option>
        </select>
        <select
          value={filters.placeno}
          onChange={(e) => setFilters({ ...filters, placeno: e.target.value })}
        >
          <option value="">Plaćeno?</option>
          <option value="PLACENO">Da</option>
          <option value="NEPLACENO">Ne</option>
        </select>
        <button className="btn-reset" onClick={resetFilters}>
          Resetuj filtere
        </button>
      </motion.div>

      {/* 📋 TABELA */}
      <motion.table
        className="rentals-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Početak</th>
            <th>Kraj</th>
            <th>Status</th>
            <th>Iznos</th>
            <th>Plaćeno</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((x) => (
                <motion.tr
                  key={x.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  <td>{x.id}</td>
                  <td>{formatDate(x.pocetak)}</td>
                  <td>{formatDate(x.kraj)}</td>
                  <td>
                    <span className={`status ${x.status?.toLowerCase()}`}>
                      {x.status}
                    </span>
                  </td>
                  <td>{(x.ukupanIznos || 0).toFixed(2)} EUR</td>
                  <td>{x.placeno ? "✅" : "❌"}</td>
                  <td className="table-actions">
                    <motion.button
                      className="btn-details"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => nav(`/app/rentals/${x.id}`)}
                    >
                      Detalji
                    </motion.button>
                    {!x.placeno && x.status === "ZAVRSENO" && (
                      <motion.button
                        className="btn-pay"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlati(x.id, x.ukupanIznos)}
                      >
                        Plati
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>Nema iznajmljivanja za ovog korisnika.</td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </motion.table>

      {/* 📊 Ukupan iznos */}
      {filtered.length > 0 && (
        <motion.div
          className="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Ukupan iznos:{" "}
          <b>
            {filtered
              .reduce((sum, x) => sum + (x.ukupanIznos || 0), 0)
              .toFixed(2)}{" "}
            EUR
          </b>
        </motion.div>
      )}
    </motion.div>
  );
}
