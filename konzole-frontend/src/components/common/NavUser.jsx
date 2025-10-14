import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NavUser = () => {
  const navigate = useNavigate();
  const radnik = (() => {
    try { return JSON.parse(localStorage.getItem("radnik")); } catch { return null; }
  })();
  const klijent = (() => {
    try { return JSON.parse(localStorage.getItem("klijent")); } catch { return null; }
  })();

  const isLoggedIn = !!(radnik || klijent);
  const displayName = radnik?.ime || klijent?.ime || null;

  const handleLogout = () => {
    localStorage.removeItem("radnik");
    localStorage.removeItem("klijent");
    navigate("/login");
  };

  const handleBrandClick = () => {
    if (radnik) navigate("/radnici");
    else navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <span
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={handleBrandClick}
        >
          Sekula Konzole
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navUser"
          aria-controls="navUser"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="navUser" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Početna</NavLink>
            </li>

            {/* Linkovi za klijenta */}
            {!radnik && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/konzole">Konzole</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/kontakt">Kontakt</NavLink>
                </li>
              </>
            )}

            {/* Linkovi za radnika/admin deo */}
            {radnik && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/klijenti">Klijenti</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/oprema">Oprema</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/iznajmljivanja">Iznajmljivanja</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/login">Prijava</Link>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2">
                <span className="navbar-text text-light">
                  {displayName ? `Zdravo, ${displayName}` : "Ulogovan korisnik"}
                </span>
                <button className="btn btn-warning btn-sm" onClick={handleLogout}>
                  Odjava
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavUser;