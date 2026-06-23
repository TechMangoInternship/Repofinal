import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { MdSearch, MdClear } from 'react-icons/md';
import IconButton from '@mui/material/IconButton';

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      id="search-bar"
      fullWidth
      size="small"
      placeholder="Search dependencies…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <MdSearch size={20} color="#94a3b8" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')} aria-label="clear search">
                <MdClear size={18} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
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
  );
};

export default SearchBar;
