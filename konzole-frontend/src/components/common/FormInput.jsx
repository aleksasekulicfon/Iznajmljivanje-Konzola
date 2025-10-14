import React from "react";

const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  touched,
  required = false,
  helpText,
  disabled = false,
  className = "mb-3",
  inputClassName = "",
  children,
  ...rest
}) => {
  const invalid = !!(touched && error);
  const controlClass =
    ["form-control", invalid ? "is-invalid" : "", inputClassName]
      .filter(Boolean)
      .join(" ");

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id || name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={controlClass.replace("form-control", "form-select")}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={id || name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={controlClass}
          {...rest}
        />
      )}

      {helpText && !invalid && (
        <div className="form-text">{helpText}</div>
      )}
      {invalid && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;