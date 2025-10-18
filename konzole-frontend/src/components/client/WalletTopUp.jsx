import { useState } from "react";
import * as KlijentService from "../../services/KlijentService";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "./WalletTopUp.css";

export default function WalletTopUp() {
  const { user } = useAuth();
  const [iznos, setIznos] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function topUp() {
    const iznosNum = Number(iznos);
    if (!iznos || isNaN(iznosNum) || iznosNum <= 0) {
      setMsg("❌ Unesite validan iznos.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      // 1️⃣ Dohvati klijenta
      const klijent = await KlijentService.getById(user.id);
      if (!klijent) {
        setMsg("❌ Klijent nije pronađen.");
        return;
      }

      // 2️⃣ Uvećaj kredit
      const noviKredit = (klijent.kredit || 0) + iznosNum;

      // 3️⃣ Pošalji izmenu na server
      await KlijentService.update(klijent.id, { ...klijent, kredit: noviKredit });

      // 4️⃣ Poruka o uspehu
      setMsg(`✅ Kredit uspešno uvećan za ${iznosNum.toFixed(2)} €`);
      setIznos("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Greška prilikom uplate.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  }

  return (
    <motion.div
      className="wallet-page"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="wallet-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="wallet-title">💳 Dopuna kredita</h2>
        <p className="wallet-subtext">
          Unesite iznos koji želite da dodate na svoj nalog.
        </p>

        <div className="wallet-input-group">
          <input
            type="number"
            className="wallet-input"
            value={iznos}
            onChange={(e) => setIznos(e.target.value)}
            placeholder="Iznos (€)"
          />
          <motion.button
            className="wallet-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !iznos}
            onClick={topUp}
          >
            {loading ? "Uplata..." : "Uplati"}
          </motion.button>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div
              className={`wallet-msg ${
                msg.startsWith("✅") ? "success" : "error"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {msg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
