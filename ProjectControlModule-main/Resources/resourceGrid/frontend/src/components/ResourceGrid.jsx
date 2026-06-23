import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getAllResources,
  createResource,
  insertResource,
  updateCell,
  deleteResource,
} from "../services/api";
import "./ResourceGrid.css";

const COLS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function ResourceGrid({ projectName, version, onReturnToProject }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // { rowId: true }
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, rowIndex }
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  // ─── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllResources(projectName, version);
      setRows(data);
    } catch {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [projectName, version]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Close context menu on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ─── Add row at end ─────────────────────────────────────────────────────────
  const handleAddRow = async () => {
    try {
      const { data } = await createResource({ resourceName: "", columns: {}, projectName, version });
      setRows((prev) => [...prev, data]);
      showToast("Row added");
    } catch {
      showToast("Failed to add row", "error");
    }
  };

  // ─── Insert row after index ──────────────────────────────────────────────────
  const handleInsertAfter = async (afterIndex) => {
    setContextMenu(null);
    try {
      const { data } = await insertResource({ afterIndex, resourceName: "", columns: {}, projectName, version });
      const updated = await getAllResources(projectName, version);
      setRows(updated.data);
      showToast(`Row inserted at position ${afterIndex + 2}`);
    } catch {
      showToast("Failed to insert row", "error");
    }
  };

  const handleInsertBefore = async (rowIndex) => {
    setContextMenu(null);
    await handleInsertAfter(rowIndex - 1);
  };

  // ─── Delete row ─────────────────────────────────────────────────────────────
  const handleDeleteRow = async (id, rowIndex) => {
    setContextMenu(null);
    if (!window.confirm("Delete this row?")) return;
    try {
      await deleteResource(id);
      setRows((prev) => prev.filter((r) => r._id !== id));
      showToast("Row deleted");
    } catch {
      showToast("Failed to delete row", "error");
    }
  };

  // ─── Cell blur → save ───────────────────────────────────────────────────────
  const handleCellBlur = async (id, col, value) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      await updateCell(id, col, value);
      // Update local state
      setRows((prev) =>
        prev.map((r) => {
          if (r._id !== id) return r;
          if (col === "resourceName") return { ...r, resourceName: value };
          return { ...r, columns: { ...r.columns, [col]: value } };
        })
      );
    } catch {
      showToast("Save failed", "error");
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  // ─── Right-click context menu ────────────────────────────────────────────────
  const handleRowRightClick = (e, rowIndex) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, rowIndex });
  };

  // ─── Get cell value ──────────────────────────────────────────────────────────
  const getCellValue = (row, col) => {
    if (!row.columns) return "";
    if (typeof row.columns === "object" && !Array.isArray(row.columns)) {
      return row.columns[col] ?? "";
    }
    return "";
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="rg-loading">
        <div className="rg-spinner" />
        <span>Connecting to database…</span>
      </div>
    );

  if (error)
    return (
      <div className="rg-error">
        <span className="rg-error-icon">⚠</span>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );

  return (
    <div className="rg-page">
      {/* Header */}
      <header className="rg-header">
        <div className="rg-header-inner">
          <div className="rg-title-block">
            {projectName ? (
              <>
                <span className="rg-eyebrow">PROJECT VERSION</span>
                <h1 className="rg-title">{projectName}</h1>
                <p className="rg-version-subtitle">{version || "Unnamed"} · Resource Grid</p>
              </>
            ) : (
              <>
                <span className="rg-eyebrow">RESOURCE PLANNER</span>
                <h1 className="rg-title">Allocation Grid</h1>
              </>
            )}
          </div>
          <div className="rg-header-actions">
            <span className="rg-row-count">{rows.length} resource{rows.length !== 1 ? "s" : ""}</span>
            <button className="rg-btn rg-btn-primary" onClick={handleAddRow}>
              <span className="rg-btn-icon">+</span> Add Resource
            </button>
            {projectName && onReturnToProject && (
              <button className="rg-btn rg-btn-return" onClick={onReturnToProject}>
                <span className="rg-btn-icon">←</span> Return to Project
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="rg-main">
        <div className="rg-table-wrap">
          <table className="rg-table">
            <thead>
              <tr>
                <th className="rg-th rg-th-resource">
                  <span>Resource Name</span>
                </th>
                {COLS.map((c) => (
                  <th key={c} className="rg-th rg-th-col">
                    <span>{c}</span>
                  </th>
                ))}
                <th className="rg-th rg-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="rg-empty">
                    <div className="rg-empty-inner">
                      <span className="rg-empty-icon">◫</span>
                      <p>No resources yet.</p>
                      <button className="rg-btn rg-btn-primary" onClick={handleAddRow}>
                        Add first resource
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr
                    key={row._id}
                    className={`rg-row ${saving[row._id] ? "rg-row--saving" : ""}`}
                    onContextMenu={(e) => handleRowRightClick(e, rowIndex)}
                  >
                    {/* Resource Name cell */}
                    <td className="rg-td rg-td-resource">
                      <input
                        className="rg-input rg-input-resource"
                        type="text"
                        defaultValue={row.resourceName || ""}
                        placeholder="Resource name…"
                        onBlur={(e) => handleCellBlur(row._id, "resourceName", e.target.value)}
                      />
                    </td>

                    {/* Columns 1–12 */}
                    {COLS.map((col) => (
                      <td key={col} className="rg-td">
                        <input
                          className="rg-input"
                          type="text"
                          defaultValue={getCellValue(row, col)}
                          placeholder="—"
                          onBlur={(e) => handleCellBlur(row._id, col, e.target.value)}
                        />
                      </td>
                    ))}

                    {/* Actions */}
                    <td className="rg-td rg-td-actions">
                      <div className="rg-actions">
                        <button
                          className="rg-icon-btn rg-icon-btn--insert"
                          title="Insert row below"
                          onClick={() => handleInsertAfter(rowIndex)}
                        >
                          ⊕
                        </button>
                        <button
                          className="rg-icon-btn rg-icon-btn--delete"
                          title="Delete row"
                          onClick={() => handleDeleteRow(row._id, rowIndex)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom add button */}
        {rows.length > 0 && (
          <div className="rg-bottom-bar">
            <button className="rg-add-row-btn" onClick={handleAddRow}>
              <span>+</span> Add row
            </button>
          </div>
        )}
      </main>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="rg-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          ref={menuRef}
        >
          <button onClick={() => handleInsertBefore(contextMenu.rowIndex)}>
            ↑ Insert row above
          </button>
          <button onClick={() => handleInsertAfter(contextMenu.rowIndex)}>
            ↓ Insert row below
          </button>
          <div className="rg-menu-divider" />
          <button
            className="rg-menu-danger"
            onClick={() =>
              handleDeleteRow(rows[contextMenu.rowIndex]._id, contextMenu.rowIndex)
            }
          >
            ✕ Delete row
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`rg-toast rg-toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
