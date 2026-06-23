import React from 'react';
import TechnicalStackGrid from './components/TechnicalStackGrid';

const PROJECT_PAGE_URL = 'http://localhost:3000';

function App() {
  // Read URL params synchronously to avoid race condition on initial load
  const params = new URLSearchParams(window.location.search);
  const projectName = params.get('projectName') || null;
  const version = params.get('version') || null;

  const handleReturnToProject = () => {
    window.location.href = PROJECT_PAGE_URL;
  };

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
                <p className="rg-subtitle">{version || 'Unnamed'} · Technical Stack</p>
              </>
            ) : (
              <>
                <span className="rg-eyebrow">TECHNICAL STACK</span>
                <h1 className="rg-title">Technical Stack Directory</h1>
              </>
            )}
          </div>
          <div className="rg-header-actions">
            {projectName && (
              <button className="rg-btn rg-btn-return" onClick={handleReturnToProject}>
                <span className="rg-btn-icon">←</span> Return to Project
              </button>
            )}
            <span className="status-badge">
              <span className="status-dot"></span>
              Auto-save enabled
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="rg-main">
        <TechnicalStackGrid projectName={projectName} version={version} />
      </main>
    </div>
  );
}

export default App;
