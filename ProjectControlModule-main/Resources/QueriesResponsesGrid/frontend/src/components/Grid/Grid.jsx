import { useState, useRef, useEffect } from 'react';
import { useGrid } from '../../hooks/useGrid';
import './Grid.css';

/**
 * Grid — main container using projectGrid's table structure.
 * Uses the useGrid hook for business logic.
 */
export default function Grid({ projectName, version }) {
  const {
    grid,
    rows,
    loading,
    error,
    searchTerm,
    savingRows,
    toasts,
    addRow,
    updateRow,
    deleteRow,
    handleSearch,
    retry,
    dismissToast,
  } = useGrid(projectName, version);

  const [contextMenu, setContextMenu] = useState(null);
  const menuRef = useRef(null);

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setContextMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRowRightClick = (e, rowIndex) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, rowIndex });
  };

  const handleDelete = (id) => {
    setContextMenu(null);
    if (!window.confirm('Delete this row?')) return;
    deleteRow(id);
  };

  if (loading) {
    return (
      <div className="rg-loading">
        <div className="rg-spinner" />
        <span>Connecting to database…</span>
      </div>
    );
  }

  if (error && !grid) {
    return (
      <div className="rg-error">
        <span className="rg-error-icon">⚠</span>
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  const columns = grid?.columns || [];

  return (
    <>
      {/* Search + Add Row toolbar */}
      <div className="rg-search-wrap">
        <div className="rg-search-input-wrap">
          <span className="rg-search-icon">🔍</span>
          <input
            className="rg-search-input"
            type="text"
            placeholder="Search queries and responses…"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <span className="rg-row-count">
          {rows.length} {rows.length === 1 ? 'row' : 'rows'}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
        <button className="rg-btn rg-btn-primary" onClick={addRow}>
          <span className="rg-btn-icon">+</span> Add Row
        </button>
      </div>

      {/* Grid Table */}
      <div className="rg-table-wrap">
        <table className="rg-table">
          <thead>
            <tr>
              <th className="rg-th" style={{ width: 44, textAlign: 'center' }}>#</th>
              {columns.map((col) => (
                <th key={col.key} className="rg-th">{col.label}</th>
              ))}
              <th className="rg-th rg-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="rg-empty">
                  <div className="rg-empty-inner">
                    <span className="rg-empty-icon">◫</span>
                    <p>
                      {searchTerm
                        ? 'No results match your search.'
                        : 'No rows yet.'}
                    </p>
                    {!searchTerm && (
                      <button className="rg-btn rg-btn-primary" onClick={addRow}>
                        Add your first row
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isSaving = savingRows.has(row._id);

                return (
                  <tr
                    key={row._id}
                    className={`rg-row ${isSaving ? 'rg-row--saving' : ''}`}
                    onContextMenu={(e) => handleRowRightClick(e, index)}
                  >
                    <td className="rg-td rg-row-num">{index + 1}</td>
                    {columns.map((col) => (
                      <td key={col.key} className="rg-td">
                        <GridCell
                          value={row.data?.[col.key] || ''}
                          rowId={row._id}
                          field={col.key}
                          onUpdate={updateRow}
                        />
                      </td>
                    ))}
                    <td className="rg-td rg-td-actions">
                      <div className="rg-actions">
                        <button
                          className="rg-icon-btn rg-icon-btn--delete"
                          title="Delete row"
                          onClick={() => handleDelete(row._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom add button */}
      {rows.length > 0 && (
        <div className="rg-bottom-bar">
          <button className="rg-add-row-btn" onClick={addRow}>
            <span>+</span> Add row
          </button>
        </div>
      )}

      {/* Footer stats */}
      <div className="rg-footer">
        <span className="rg-footer__stat">
          {rows.length} {rows.length === 1 ? 'row' : 'rows'}
        </span>
        <span className="rg-footer__hint">
          Click a cell to edit · Enter to save · Esc to cancel
        </span>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="rg-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          ref={menuRef}
        >
          <button
            className="rg-menu-danger"
            onClick={() => handleDelete(rows[contextMenu.rowIndex]._id)}
          >
            ✕ Delete row
          </button>
        </div>
      )}

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`rg-toast rg-toast--${t.type}`}
              onClick={() => dismissToast(t.id)}
              style={{ cursor: 'pointer', position: 'static', marginBottom: 8 }}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * GridCell — inline editable cell with auto-save.
 */
function GridCell({ value, field, rowId, onUpdate }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onUpdate(rowId, field, localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      e.target.blur();
    }
  };

  return (
    <textarea
      className="rg-cell-textarea"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      rows={1}
      placeholder="Click to edit…"
    />
  );
}
