import Grid from './components/Grid/Grid';
import './App.css';

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
                <p className="rg-subtitle">{version || 'Unnamed'} · Queries &amp; Responses</p>
              </>
            ) : (
              <>
                <span className="rg-eyebrow">QUERIES &amp; RESPONSES</span>
                <h1 className="rg-title">Queries &amp; Responses</h1>
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
        <Grid projectName={projectName} version={version} />
      </main>
    </div>
  );
}

export default App;
