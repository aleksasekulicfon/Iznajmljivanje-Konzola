import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-card">
        <h1>🎮 Dobro došli</h1>
        <p>Izaberite željenu akciju ispod:</p>
        <div className="home-buttons">
          <Link to="/app/catalog" className="btn primary">Katalog</Link>
          <Link to="/app/rentals" className="btn secondary">Moja iznajmljivanja</Link>
          <Link to="/app/wallet" className="btn tertiary">Kredit</Link>
        </div>
      </div>
    </div>
  );
}