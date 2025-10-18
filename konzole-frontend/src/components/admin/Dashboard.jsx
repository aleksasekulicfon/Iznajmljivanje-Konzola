import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const cards = [
    { to: "/admin/iznajmljivanja", title: "Iznajmljivanja", icon: "📋" },
    { to: "/admin/klijenti", title: "Klijenti", icon: "👥" },
    { to: "/admin/radnici", title: "Radnici", icon: "👨🏿‍💼" },
    { to: "/admin/oprema/konzole", title: "Konzole", icon: "🎮" },
    { to: "/admin/oprema/dodatna", title: "Dodatna oprema", icon: "🎧" },
  ];

  return (
    <div className="dashboard-container container mt-5">
      <h2 className="dashboard-title">Administracija</h2>
      <p className="dashboard-subtitle">
        Pregledaj i upravljaj podacima sistema
      </p>

      <div className="dashboard-grid">
        {cards.map((c) => (
          <div className="dashboard-card" key={c.to}>
            <div className="icon">{c.icon}</div>
            <h5>{c.title}</h5>
            <Link className="btn-open" to={c.to}>
              Otvori
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}