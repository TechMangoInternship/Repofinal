import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import { MdAccountTree, MdArrowBack } from 'react-icons/md';
import SearchBar from '../components/SearchBar';
import DependencyForm from '../components/DependencyForm';
import DependencyGrid from '../components/DependencyGrid';
import dependencyApi from '../services/dependencyApi';

const DependencyPage = ({ projectName, version, onReturnToProject }) => {
  const [dependencies, setDependencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchDependencies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dependencyApi.getAll(searchQuery);
      setDependencies(data);
    } catch (error) {
      showSnackbar('Failed to fetch dependencies', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(fetchDependencies, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchDependencies]);

  const handleAdd = async (text) => {
    try {
      await dependencyApi.create(text);
      showSnackbar('Dependency added successfully');
      fetchDependencies();
    } catch (error) {
      showSnackbar('Failed to add dependency', 'error');
      console.error(error);
    }
  };

  const handleUpdate = async (id, text) => {
    try {
      await dependencyApi.update(id, text);
      showSnackbar('Dependency updated successfully');
      fetchDependencies();
    } catch (error) {
      showSnackbar('Failed to update dependency', 'error');
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dependencyApi.remove(deleteDialog.id);
      showSnackbar('Dependency deleted successfully');
      setDeleteDialog({ open: false, id: null });
      fetchDependencies();
    } catch (error) {
      showSnackbar('Failed to delete dependency', 'error');
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #0c1a2e 40%, #0f172a 100%)',
        py: 5,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Return to Project button */}
        {projectName && onReturnToProject && (
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={onReturnToProject}
              startIcon={<MdArrowBack />}
              sx={{
                textTransform: 'none',
                color: '#94a3b8',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                px: 2,
                py: 0.75,
                fontSize: '0.85rem',
                '&:hover': {
                  color: '#38bdf8',
                  borderColor: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.06)',
                },
              }}
            >
              Return to Project
            </Button>
          </Box>
        )}

        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(14, 165, 233, 0.35)',
              }}
            >
              <MdAccountTree size={26} color="#fff" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e2e8f0 0%, #7dd3fc 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dependency Grid
            </Typography>
          </Box>
          {projectName ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {projectName} · {version || 'Unnamed'} · Dependencies
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Track and manage your project dependencies
            </Typography>
          )}
          <Chip
            label={`${dependencies.length} dependenc${dependencies.length !== 1 ? 'ies' : 'y'}`}
            size="small"
            sx={{
              mt: 1.5,
              backgroundColor: 'rgba(14, 165, 233, 0.15)',
              color: '#7dd3fc',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Box>
        </Box>

        {/* Add Form */}
        <Box sx={{ mb: 3 }}>
          <DependencyForm onAdd={handleAdd} />
        </Box>

        {/* Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#0ea5e9' }} />
          </Box>
        ) : (
          <DependencyGrid
            dependencies={dependencies}
            onUpdate={handleUpdate}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: '12px' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backgroundColor: '#1e293b',
              backgroundImage: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Delete Dependency</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this dependency? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              id="cancel-delete-button"
              onClick={() => setDeleteDialog({ open: false, id: null })}
              sx={{ textTransform: 'none', borderRadius: '10px' }}
            >
              Cancel
            </Button>
            <Button
              id="confirm-delete-button"
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                fontWeight: 600,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DependencyPage;
