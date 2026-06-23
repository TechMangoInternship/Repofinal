import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchProjects,
  createProject,
  insertProject,
  updateCell,
  deleteProject,
  addVersion,
  deleteVersion,
  updateVersion,
} from "./api";
import "./App.css";

/* ── Grid navigation config ────────────────────────────────────── */
/*
 * NOTE: These URLs point to the dev servers for each grid.
 * Since multiple apps default to port 3000, you may need to run
 * them on different ports to use them simultaneously.
 * Adjust these URLs as needed.
 */
const GRID_LINKS = [
  {
    name: "Technical Stack",
    url: "http://localhost:5173",
    desc: "Manage technical stack items",
    icon: "TS",
  },
  {
    name: "Queries & Responses",
    url: "http://localhost:5174",
    desc: "Manage queries and responses",
    icon: "Q\u0026R",
  },
  {
    name: "Resource Grid",
    url: "http://localhost:3001",
    desc: "Manage resource allocation",
    icon: "RG",
  },
  {
    name: "Assumptions",
    url: "http://localhost:5175",
    desc: "Manage project assumptions",
    icon: "AG",
  },
  {
    name: "Dependencies",
    url: "http://localhost:3002",
    desc: "Manage project dependencies",
    icon: "DG",
  },
  {
    name: "Features Grid",
    url: "http://localhost:3003",
    desc: "Manage project features",
    icon: "FG",
  },
];

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [newVersionNames, setNewVersionNames] = useState({});
  const [editingVersion, setEditingVersion] = useState(null); // { projectId, versionId }
  const menuRef = useRef(null);

  // ── Load data ──────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchProjects();
      setRows(data);
    } catch {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Close context menu on outside click ────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setContextMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Toast helper ───────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Add row at end ─────────────────────────────────────────────
  const handleAddRow = async () => {
    try {
      const { data } = await createProject({ projectName: "", columns: {} });
      setRows((prev) => [...prev, data]);
      showToast("Row added");
    } catch {
      showToast("Failed to add row", "error");
    }
  };

  // ── Insert row after index ─────────────────────────────────────
  const handleInsertAfter = async (afterIndex) => {
    setContextMenu(null);
    try {
      await insertProject({ afterIndex, projectName: "", columns: {} });
      const { data } = await fetchProjects();
      setRows(data);
      showToast(`Row inserted at position ${afterIndex + 2}`);
    } catch {
      showToast("Failed to insert row", "error");
    }
  };

  const handleInsertBefore = (rowIndex) => handleInsertAfter(rowIndex - 1);

  // ── Delete row ─────────────────────────────────────────────────
  const handleDeleteRow = async (id) => {
    setContextMenu(null);
    if (!window.confirm("Delete this row?")) return;
    try {
      await deleteProject(id);
      setRows((prev) => prev.filter((r) => r._id !== id));
      showToast("Row deleted");
    } catch {
      showToast("Failed to delete row", "error");
    }
  };

  // ── Cell blur → save ───────────────────────────────────────────
  const handleCellBlur = async (id, col, value) => {
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      await updateCell(id, col, value);
      setRows((prev) =>
        prev.map((r) => {
          if (r._id !== id) return r;
          if (col === "projectName") return { ...r, projectName: value };
          return { ...r, columns: { ...r.columns, [col]: value } };
        })
      );
    } catch {
      showToast("Save failed", "error");
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  // ── Right-click context menu ───────────────────────────────────
  const handleRowRightClick = (e, rowIndex) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, rowIndex });
  };

  // ── Toggle expand version controls ─────────────────────────────
  const toggleExpand = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Add version to project ─────────────────────────────────────
  const handleAddVersion = async (projectId) => {
    const name = (newVersionNames[projectId] || "").trim();
    if (!name) {
      showToast("Please enter a version name", "error");
      return;
    }
    try {
      const { data } = await addVersion(projectId, name);
      setRows((prev) => prev.map((r) => (r._id === projectId ? data : r)));
      setNewVersionNames((prev) => ({ ...prev, [projectId]: "" }));
      showToast(`Version "${name}" added`);
    } catch {
      showToast("Failed to add version", "error");
    }
  };

  // ── Delete version ─────────────────────────────────────────────
  const handleDeleteVersion = async (projectId, versionId, versionName) => {
    if (!window.confirm(`Delete version "${versionName || versionId}"?`))
      return;
    try {
      const { data } = await deleteVersion(projectId, versionId);
      setRows((prev) => prev.map((r) => (r._id === projectId ? data : r)));
      showToast("Version deleted");
    } catch {
      showToast("Failed to delete version", "error");
    }
  };

  // ── Save version rename ────────────────────────────────────────
  const handleRenameVersion = async (projectId, versionId, newName) => {
    if (!newName.trim()) {
      showToast("Version name cannot be empty", "error");
      return;
    }
    try {
      const { data } = await updateVersion(projectId, versionId, newName);
      setRows((prev) => prev.map((r) => (r._id === projectId ? data : r)));
      setEditingVersion(null);
      showToast("Version renamed");
    } catch {
      showToast("Failed to rename version", "error");
    }
  };

  // ── Navigate to grid with context ──────────────────────────────
  const navigateToGrid = (baseUrl, projectName, versionName) => {
    const params = new URLSearchParams({
      projectName: projectName || "Untitled",
      version: versionName || "Unnamed",
    });
    window.open(`${baseUrl}?${params.toString()}`, "_blank");
  };

  // ── Render ─────────────────────────────────────────────────────
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
            <span className="rg-eyebrow">PROJECT PLANNER</span>
            <h1 className="rg-title">Project Grid</h1>
          </div>
          <div className="rg-header-actions">
            <span className="rg-row-count">
              {rows.length} project{rows.length !== 1 ? "s" : ""}
            </span>
            <button className="rg-btn rg-btn-primary" onClick={handleAddRow}>
              <span className="rg-btn-icon">+</span> Add Project
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="rg-main">
        <div className="rg-table-wrap">
          <table className="rg-table">
            <thead>
              <tr>
                <th className="rg-th rg-th-project">Project Name</th>
                <th className="rg-th rg-th-version">Version Controls</th>
                <th className="rg-th rg-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="rg-empty">
                    <div className="rg-empty-inner">
                      <span className="rg-empty-icon">◫</span>
                      <p>No projects yet.</p>
                      <button
                        className="rg-btn rg-btn-primary"
                        onClick={handleAddRow}
                      >
                        Add first project
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <React.Fragment key={row._id}>
                    <tr
                      className={`rg-row ${
                        saving[row._id] ? "rg-row--saving" : ""
                      }`}
                      onContextMenu={(e) => handleRowRightClick(e, rowIndex)}
                    >
                      {/* Project Name */}
                      <td className="rg-td rg-td-project">
                        <input
                          className="rg-input"
                          type="text"
                          defaultValue={row.projectName || ""}
                          placeholder="Project name…"
                          onBlur={(e) =>
                            handleCellBlur(
                              row._id,
                              "projectName",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* Version Controls */}
                      <td className="rg-td rg-td-version">
                        <div className="rg-version-cell">
                          <div className="rg-version-summary">
                            <span className="rg-version-count">
                              {(row.versions || []).length} version
                              {(row.versions || []).length !== 1 ? "s" : ""}
                            </span>
                            <button
                              className="rg-expand-btn"
                              onClick={() => toggleExpand(row._id)}
                              title={
                                expandedRows.has(row._id)
                                  ? "Collapse versions"
                                  : "Expand versions"
                              }
                            >
                              <span
                                className={`rg-expand-arrow ${
                                  expandedRows.has(row._id)
                                    ? "rg-expand-arrow--open"
                                    : ""
                                }`}
                              >
                                ▸
                              </span>
                            </button>
                          </div>

                          {expandedRows.has(row._id) && (
                            <div className="rg-version-detail">
                              {/* Existing versions */}
                              {(row.versions || []).length === 0 ? (
                                <div className="rg-version-empty">
                                  No versions yet
                                </div>
                              ) : (
                                <div className="rg-version-list">
                                  {(row.versions || []).map((ver) => (
                                    <div
                                      key={ver._id}
                                      className="rg-version-item"
                                    >
                                      {editingVersion &&
                                      editingVersion.projectId ===
                                        row._id &&
                                      editingVersion.versionId ===
                                        ver._id ? (
                                        <input
                                          className="rg-input rg-input--mini"
                                          type="text"
                                          defaultValue={ver.versionName}
                                          autoFocus
                                          onBlur={(e) => {
                                            handleRenameVersion(
                                              row._id,
                                              ver._id,
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleRenameVersion(
                                                row._id,
                                                ver._id,
                                                e.target.value
                                              );
                                            }
                                            if (e.key === "Escape") {
                                              setEditingVersion(null);
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span
                                          className="rg-version-name"
                                          onDoubleClick={() =>
                                            setEditingVersion({
                                              projectId: row._id,
                                              versionId: ver._id,
                                            })
                                          }
                                          title="Double-click to rename"
                                        >
                                          {ver.versionName || "Unnamed"}
                                        </span>
                                      )}

                                      <div className="rg-version-links">
                                        <span className="rg-version-link-label">
                                          Open in:
                                        </span>
                                        {GRID_LINKS.map((grid) => (
                                          <button
                                            key={grid.name}
                                            className="rg-version-link-btn"
                                            title={`Open in ${grid.name}`}
                                            onClick={() =>
                                              navigateToGrid(
                                                grid.url,
                                                row.projectName,
                                                ver.versionName
                                              )
                                            }
                                          >
                                            {grid.icon}
                                          </button>
                                        ))}
                                        <button
                                          className="rg-version-del-btn"
                                          title="Delete version"
                                          onClick={() =>
                                            handleDeleteVersion(
                                              row._id,
                                              ver._id,
                                              ver.versionName
                                            )
                                          }
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add new version */}
                              <div className="rg-version-add">
                                <input
                                  className="rg-input rg-input--mini"
                                  type="text"
                                  placeholder="Version name…"
                                  value={newVersionNames[row._id] || ""}
                                  onChange={(e) =>
                                    setNewVersionNames((prev) => ({
                                      ...prev,
                                      [row._id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleAddVersion(row._id);
                                  }}
                                />
                                <button
                                  className="rg-version-add-btn"
                                  onClick={() => handleAddVersion(row._id)}
                                  title="Add version"
                                >
                                  + Add
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

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
                            onClick={() => handleDeleteRow(row._id)}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
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
            onClick={() => handleDeleteRow(rows[contextMenu.rowIndex]._id)}
          >
            ✕ Delete row
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`rg-toast rg-toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
