import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer mt-auto text-light">
      <div className="footer-top-gradient" />
      <div className="container py-4">
        <div className="row g-3 align-items-center justify-content-between">
          {/* Leva strana */}
          <div className="col-12 col-md-auto text-center text-md-start">
            <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
              <span className="fw-semibold fs-5">🎮 Sekula Konzole</span>
              <span className="vr d-none d-md-inline opacity-50" />
              <small className="opacity-75">© {year}</small>
            </div>
            <small className="d-block mt-1 opacity-75">
              Iznajmljivanje konzola i dodatne opreme.
            </small>
          </div>

          {/* Desna strana */}
          <div className="col-12 col-md-auto text-center text-md-end">
            <ul className="nav justify-content-center justify-content-md-end small footer-links">
              <li className="nav-item">
                <a className="nav-link px-2 footer-link" href="#">Uslovi</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-2 footer-link" href="#">Privatnost</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-2 footer-link" href="#">Kontakt</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}