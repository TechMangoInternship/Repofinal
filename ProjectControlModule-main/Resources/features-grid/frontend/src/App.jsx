import React from 'react';
import FeatureGrid from './components/FeatureGrid';
import './App.css';

const PROJECT_PAGE_URL = 'http://localhost:3000';

function App() {
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
                <p className="rg-subtitle">{version || 'Unnamed'} · Features Grid</p>
              </>
            ) : (
              <>
                <span className="rg-eyebrow">FEATURES GRID</span>
                <h1 className="rg-title">Features Grid Directory</h1>
              </>
            )}
          </div>
          <div className="rg-header-actions">
            {projectName && (
              <button className="rg-btn rg-btn-return" onClick={handleReturnToProject}>
                <span className="rg-btn-icon">←</span> Return to Project
              </button>
            )}
            <span className="rg-row-count">Auto-save enabled</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="rg-main">
        <FeatureGrid projectName={projectName} version={version} onReturnToProject={handleReturnToProject} />
      </main>
    </div>
  );
}

export default App;
