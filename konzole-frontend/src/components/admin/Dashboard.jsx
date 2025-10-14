import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container mt-4">
      <h3 className="mb-3">Administracija</h3>
      <div className="row g-3">
        {[
          { to: "/admin/iznajmljivanja", title: "Iznajmljivanja" },
          { to: "/admin/klijenti", title: "Klijenti" },
          { to: "/admin/radnici", title: "Radnici" },
          { to: "/admin/oprema/konzole", title: "Konzole" },
          { to: "/admin/oprema/dodatna", title: "Dodatna oprema" },
        ].map((c) => (
          <div className="col-sm-6 col-md-4" key={c.to}>
            <div className="card h-100">
              <div className="card-body">
                <h5>{c.title}</h5>
                <Link className="btn btn-outline-primary mt-2" to={c.to}>Otvori</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}