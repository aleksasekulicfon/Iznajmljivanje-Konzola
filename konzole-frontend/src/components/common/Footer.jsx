export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer bg-dark text-light mt-auto border-top border-secondary">
      <div className="container py-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold">Sekula Konzole</span>
              <span className="vr d-none d-md-inline opacity-50" />
              <small className="opacity-75">© {year}</small>
            </div>
            <small className="d-block mt-1 opacity-75">
              Iznajmljivanje konzola i dodatne opreme.
            </small>
          </div>

          <div className="col-12 col-md-auto">
            <ul className="nav justify-content-start justify-content-md-end small">
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