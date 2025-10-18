import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  function goHome() {
    if (!user) return navigate("/login");
    navigate(user.role === "RADNIK" ? "/admin" : "/app");
  }

  function goProfile() {
    if (!user) return;
    navigate(user.role === "RADNIK" ? "/admin/profil" : "/app/profil");
  }

  return (
    <nav className="navbar navbar-expand-lg app-navbar shadow-sm sticky-top">
      <div className="container">
        <span
          className="navbar-brand fw-bold text-light d-flex align-items-center gap-2 logo-container"
          onClick={goHome}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">🎮</span>
          <span>Sekula Konzole</span>
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-links">
            {user?.role === "RADNIK" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/iznajmljivanja">
                    Iznajmljivanja
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/klijenti">
                    Klijenti
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/radnici">
                    Radnici
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/oprema/konzole">
                    Konzole
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/oprema/dodatna">
                    Dodatna oprema
                  </Link>
                </li>
              </>
            )}
            {user?.role === "KLIJENT" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/app/catalog">
                    Katalog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/app/rentals">
                    Moja iznajmljivanja
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/app/wallet">
                    Kredit
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* User menu */}
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                {isLoginPage ? (
                  <li className="nav-item d-flex gap-2">
                    <Link className="btn btn-success px-3" to="/login">
                      Prijava
                    </Link>
                    <Link
                      className="btn btn-outline-light px-3"
                      to="/register-client"
                    >
                      Registracija
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="btn btn-success px-3" to="/login">
                      Prijava
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-profile dropdown-toggle d-flex align-items-center gap-2"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  <span>{user.username}</span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-2"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={goProfile}
                    >
                      <i className="bi bi-gear"></i> Izmeni profil
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Odjava
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
