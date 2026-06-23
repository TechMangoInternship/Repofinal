import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { MdAdd } from 'react-icons/md';

const AssumptionForm = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <TextField
        id="add-assumption-input"
        fullWidth
        size="small"
        placeholder="Enter a new assumption…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.09)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          },
        }}
      />
      <Button
        id="add-assumption-button"
        type="submit"
        variant="contained"
        disabled={!text.trim()}
        startIcon={<MdAdd size={20} />}
        sx={{
          borderRadius: '12px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'none',
          },
        }}
      >
        Add
      </Button>
    </Box>
  );
};

export default AssumptionForm;
