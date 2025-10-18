import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as IznService from "../../services/IznajmljivanjeService";
import * as KlijentService from "../../services/KlijentService";
import * as OpremaService from "../../services/OpremaService";
import { getConsoleImage as getImagePath } from "../../utils/images";
import "./RentalDetail.css";

export default function RentalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [rental, setRental] = useState(null);
  const [stavke, setStavke] = useState([]);
  const [klijent, setKlijent] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const r = await IznService.get(id);
        setRental(r);
        if (r.klijentId) {
          const k = await KlijentService.getById(r.klijentId);
          setKlijent(k);
        }
        const st = await IznService.listStavke(id);
        setStavke(st);
      } catch (err) {
        console.error("Greška prilikom učitavanja:", err);
      }
    }
    load();
  }, [id]);

  async function handlePlati() {
    try {
      // 🔹 prvo dohvatimo klijenta
      const klijent = await KlijentService.getById(rental.klijentId);
      const iznos = rental.ukupanIznos || 0;

      // 🔸 provera kredita
      if (!klijent || klijent.kredit < iznos) {
        setMsg("❌ Nedovoljno kredita za plaćanje.");
        return;
      }

      // 🔹 ažuriraj kredit klijenta
      const noviKredit = klijent.kredit - iznos;
      await KlijentService.update(klijent.id, { ...klijent, kredit: noviKredit });

      // 🔹 pozovi endpoint /plati
      await IznService.plati(rental.id);

      // 🔹 lokalno osveži stanje
      setRental((prev) => ({ ...prev, placeno: true }));
      setMsg("✅ Uspešno ste platili iznajmljivanje!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Greška prilikom plaćanja.");
    }
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

  if (!rental)
    return (
      <motion.div
        className="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Učitavanje...
      </motion.div>
    );

  return (
    <motion.div
      className="rental-detail-page"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="rental-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2>
          <span className="purple">Iznajmljivanje</span> #{rental.id}
        </h2>

        <div className="status-badges">
          <motion.span
            className={`status-badge ${rental.status?.toLowerCase()}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {rental.status}
          </motion.span>

          <motion.span
            className={`pay-badge ${rental.placeno ? "paid" : "unpaid"}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {rental.placeno ? "Plaćeno ✅" : "Nije plaćeno ❌"}
          </motion.span>
        </div>
      </motion.div>

      <AnimatePresence>
        {msg && (
          <motion.div
            className="rental-msg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="rental-info"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {[
          {
            label: "Klijent",
            value: klijent ? `${klijent.ime} ${klijent.prezime}` : "-",
          },
          { label: "Početak", value: formatDate(rental.pocetak) },
          { label: "Kraj", value: formatDate(rental.kraj) },
          { label: "Status", value: rental.status },
          {
            label: "Ukupan iznos",
            value: `${(rental.ukupanIznos || 0).toFixed(2)} €`,
          },
          {
            label: "Kredit klijenta",
            value: `${(klijent?.kredit || 0).toFixed(2)} €`,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="rental-info-box"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <h4>{item.label}</h4>
            <p>{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.h3
        className="section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        🎮 Stavke iznajmljivanja
      </motion.h3>

      <motion.div
        className="rental-items"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
          },
        }}
      >
        {stavke.length > 0 ? (
          stavke.map((s) => {
            const imageSrc = getImagePath(s.slikaUrl || s.opremaNaziv);
            return (
              <motion.div
                key={s.rb}
                className="item-card"
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px rgba(255, 0, 127, 0.5)",
                }}
                transition={{ duration: 0.3 }}
              >
                <img src={imageSrc} alt={s.opremaNaziv} />
                <h4>{s.opremaNaziv}</h4>
                <p>
                  <b>{s.cena.toFixed(2)} € / sat</b>
                </p>
                <p>Količina: {s.kolicina}</p>
                <p>Vreme: {s.ukupnoVreme || 0} h</p>
                <p>Iznos: {(s.iznos || 0).toFixed(2)} €</p>
              </motion.div>
            );
          })
        ) : (
          <p>Nema stavki za ovo iznajmljivanje.</p>
        )}
      </motion.div>

      <motion.div
        className="rental-actions"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {!rental.placeno && rental.status === "ZAVRSENO" && (
          <motion.button
            className="btn-pay"
            onClick={handlePlati}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Plati iznajmljivanje
          </motion.button>
        )}
        <motion.button
          className="btn-back"
          onClick={() => nav(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅ Nazad
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
