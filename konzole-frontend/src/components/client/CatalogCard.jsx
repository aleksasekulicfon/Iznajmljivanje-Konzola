import React from "react";
import { getConsoleImage } from "../../utils/images";

export default function CatalogCard({ item, onRent }) {
  const imgSrc = getConsoleImage(item.slikaUrl || item.naziv || item.model);

  return (
    <div className="card h-100 shadow-sm">
      <div className="ratio ratio-4x3 bg-body-tertiary">
        <img
          src={imgSrc}
          alt={item.naziv}
          className="rounded-top object-fit-contain p-2"
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <h5 className="card-title mb-1">{item.naziv}</h5>
        {item.opis && <p className="card-text text-muted small">{item.opis}</p>}
        <div className="d-flex justify-content-between align-items-center">
          {item.cenaPoSatu != null && (
            <span className="fw-semibold">{item.cenaPoSatu} RSD/h</span>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => onRent?.(item)}>
            Iznajmi
          </button>
        </div>
      </div>
    </div>
  );
}