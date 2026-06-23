import React from "react";
import ResourceGrid from "./components/ResourceGrid";

const PROJECT_PAGE_URL = "http://localhost:3000";

function App() {
  // Read URL params synchronously to avoid race condition on initial load
  const params = new URLSearchParams(window.location.search);
  const projectName = params.get("projectName") || null;
  const version = params.get("version") || null;

  const handleReturnToProject = () => {
    window.location.href = PROJECT_PAGE_URL;
  };

  return (
    <ResourceGrid
      projectName={projectName}
      version={version}
      onReturnToProject={handleReturnToProject}
    />
  );
}

export default App;
