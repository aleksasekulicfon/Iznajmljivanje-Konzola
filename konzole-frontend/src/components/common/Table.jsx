import React, { useMemo, useState } from "react";
import Spinner from "./Spinner";

/**
 * Generic Table
 * Props:
 *  - columns: [{ key: 'ime', header: 'Ime', sortable?: true, className?, render?: (row) => JSX }]
 *  - data: array of objects
 *  - loading: bool
 *  - emptyMessage: string
 *  - striped, hover, small, responsive: bool
 *  - onRowClick?: (row) => void
 *  - defaultSort?: { key: string, dir: 'asc' | 'desc' }
 *  - onSortChange?: ({key, dir}) => void  (ako želiš spolja da vodiš sortiranje)
 */
const Table = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = "Nema podataka.",
  striped = true,
  hover = true,
  small = false,
  responsive = true,
  onRowClick,
  defaultSort,
  onSortChange,
}) => {
  const [sort, setSort] = useState(defaultSort || null);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const { key, dir } = sort;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = a?.[key];
      const vb = b?.[key];
      if (va == null && vb == null) return 0;
      if (va == null) return dir === "asc" ? -1 : 1;
      if (vb == null) return dir === "asc" ? 1 : -1;
      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [data, sort]);

  const handleSort = (col) => {
    if (!col.sortable) return;
    setSort((prev) => {
      const next =
        prev?.key === col.key
          ? { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" }
          : { key: col.key, dir: "asc" };
      onSortChange?.(next);
      return next;
    });
  };

  const tableEl = (
    <table
      className={[
        "table",
        striped ? "table-striped" : "",
        hover ? "table-hover" : "",
        small ? "table-sm" : "",
        "align-middle",
      ].join(" ")}
    >
      <thead className="table-light">
        <tr>
          {columns.map((c) => {
            const isSorted = sort?.key === c.key;
            const arrow = isSorted ? (sort.dir === "asc" ? " ↑" : " ↓") : "";
            const clickable = c.sortable ? "user-select-none" : "";
            return (
              <th
                key={c.key}
                scope="col"
                className={`${clickable} ${c.className || ""}`}
                style={c.sortable ? { cursor: "pointer" } : undefined}
                onClick={() => handleSort(c)}
              >
                {c.header}{arrow}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length}>
              <div className="py-3 d-flex justify-content-center">
                <Spinner inline size="sm" text="Učitavanje..." />
                <span className="ms-2">Učitavanje...</span>
              </div>
            </td>
          </tr>
        ) : sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center text-muted py-3">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          sorted.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className={c.className || ""}>
                  {c.render ? c.render(row) : String(row?.[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return responsive ? <div className="table-responsive">{tableEl}</div> : tableEl;
};

export default Table;