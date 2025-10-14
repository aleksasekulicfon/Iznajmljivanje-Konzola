import { useEffect, useState } from "react";
import * as OpremaService from "../../services/OpremaService";
import { getConsoleImage } from "../../utils/images";

export default function Catalog() {
  const [konzole, setKonzole] = useState([]);
  const [dodatna, setDodatna] = useState([]);

  useEffect(() => {
    OpremaService.listKonzole().then(setKonzole);
    OpremaService.listDodatna().then(setDodatna);
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Konzole</h4>
      <div className="row g-3">
        {konzole.map((k) => {
          const imgSrc = getConsoleImage(k.slikaUrl || k.naziv || k.model, "konzole");
          return (
            <div className="col-12 col-sm-6 col-md-4" key={k.id}>
              <div className="card h-100 shadow-sm">
                <div className="ratio ratio-4x3 bg-body-tertiary">
                  <img
                    src={imgSrc}
                    alt={k.naziv}
                    className="w-100 h-100 object-fit-contain p-2 rounded-top"
                    loading="lazy"
                  />
                </div>

                <div className="card-body">
                  <h5 className="card-title mb-1">{k.naziv}</h5>
                  <div className="text-muted small">{k.proizvodjac}</div>
                  <div className="mt-2">
                    <b>{k.cena}</b> RSD / sat
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h4 className="mt-4 mb-3">Dodatna oprema</h4>
      <div className="row g-3">
        {dodatna.map((d) => {
          const imgSrc = getConsoleImage(d.slikaUrl || d.naziv || d.tip, "dodatna");
          return (
            <div className="col-12 col-sm-6 col-md-4" key={d.id}>
              <div className="card h-100 shadow-sm">
                <div className="ratio ratio-4x3 bg-body-tertiary">
                  <img
                    src={imgSrc}
                    alt={d.naziv}
                    className="w-100 h-100 object-fit-contain p-2 rounded-top"
                    loading="lazy"
                  />
                </div>

                <div className="card-body">
                  <h5 className="card-title mb-1">{d.naziv}</h5>
                  <div className="text-muted small">{d.tip}</div>
                  <div className="mt-2">
                    <b>{d.cena}</b> RSD / sat
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}