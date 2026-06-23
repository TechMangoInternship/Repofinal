import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DependencyPage from './pages/DependencyPage';

const PROJECT_PAGE_URL = 'http://localhost:3000';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#6366f1',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 transparent',
        },
      },
    },
  },
});

const App = () => {
  // Read URL params synchronously to avoid race condition on initial load
  const params = new URLSearchParams(window.location.search);
  const projectName = params.get('projectName') || null;
  const version = params.get('version') || null;

  const handleReturnToProject = () => {
    window.location.href = PROJECT_PAGE_URL;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DependencyPage
        projectName={projectName}
        version={version}
        onReturnToProject={handleReturnToProject}
      />
    </ThemeProvider>
  );
};

export default App;

