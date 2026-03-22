"use client";

import Link from "next/link";

export type Column<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
};

export default function DataTable<T extends { id?: string; slug?: string }>({
  columns,
  rows,
  editHref,
  onDelete,
}: {
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  onDelete?: (row: T) => void;
}) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center py-16 text-sm"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }}
      >
        Aucun élément pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                {col.label}
              </th>
            ))}
            {(editHref || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom: ri < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              }}
            >
              {columns.map((col, ci) => (
                <td key={ci} className="px-4 py-3 text-white">
                  {col.render(row)}
                </td>
              ))}
              {(editHref || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editHref && (
                      <Link
                        href={editHref(row)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}
                      >
                        Éditer
                      </Link>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
