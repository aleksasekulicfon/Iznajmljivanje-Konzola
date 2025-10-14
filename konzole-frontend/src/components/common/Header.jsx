import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function goHome() {
    if (!user) return navigate("/login");
    navigate(user.role === "RADNIK" ? "/admin" : "/app");
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark app-navbar shadow-sm sticky-top">
      <div className="container">
        <span className="navbar-brand fw-semibold" style={{ cursor: "pointer" }} onClick={goHome}>
          Sekula Konzole
        </span>

        {/* toggler za mobilni meni */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {user?.role === "RADNIK" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin/iznajmljivanja">Iznajmljivanja</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/klijenti">Klijenti</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/radnici">Radnici</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/oprema/konzole">Konzole</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/oprema/dodatna">Dodatna oprema</Link></li>
              </>
            )}
            {user?.role === "KLIJENT" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/app/catalog">Katalog</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/app/rentals">Moja iznajmljivanja</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/app/wallet">Kredit</Link></li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user ? (
              <li className="nav-item">
                <Link className="btn btn-success" to="/login">Prijava</Link>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2">
                <span className="text-light small opacity-75">
                  {user.username} ({user.role})
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>Odjava</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}