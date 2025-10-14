import React from "react";

const Spinner = ({ fullscreen = false, text = "Učitavanje…", inline = false, size = "md" }) => {
  const sizeClass = size === "sm" ? "spinner-border-sm" : size === "lg" ? "spinner-border-lg" : "";
  const spinnerEl = (
    <div className={`spinner-border ${sizeClass}`} role="status" aria-live="polite">
      <span className="visually-hidden">{text}</span>
    </div>
  );

  if (inline) return spinnerEl;

  if (fullscreen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-body bg-opacity-50"
        style={{ zIndex: 1055 }}
      >
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          {spinnerEl}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      {spinnerEl}
    </div>
  );
};

export default Spinner;