import React, { useState } from 'react';
import { TableRow, TableCell, TextField, IconButton, Tooltip } from '@mui/material';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

const AssumptionRow = ({ assumption, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(assumption.text);

  const handleSave = () => {
    if (!editText.trim()) return;
    onUpdate(assumption._id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(assumption.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <TableRow
      sx={{
        transition: 'background 0.15s ease',
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.06)',
        },
      }}
    >
      <TableCell
        sx={{
          width: 60,
          fontWeight: 600,
          color: 'text.secondary',
          fontSize: '0.85rem',
        }}
      >
        {index + 1}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            }}
          />
        ) : (
          <span style={{ fontSize: '0.9rem' }}>{assumption.text}</span>
        )}
      </TableCell>
      <TableCell align="right" sx={{ width: 120 }}>
        {isEditing ? (
          <>
            <Tooltip title="Save" arrow>
              <IconButton
                id={`save-assumption-${assumption._id}`}
                size="small"
                onClick={handleSave}
                sx={{
                  color: '#22c55e',
                  '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.12)' },
                }}
              >
                <MdCheck size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel" arrow>
              <IconButton
                id={`cancel-assumption-${assumption._id}`}
                size="small"
                onClick={handleCancel}
                sx={{
                  color: '#f97316',
                  '&:hover': { backgroundColor: 'rgba(249, 115, 22, 0.12)' },
                }}
              >
                <MdClose size={20} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Edit" arrow>
              <IconButton
                id={`edit-assumption-${assumption._id}`}
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{
                  color: '#6366f1',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)' },
                }}
              >
                <MdEdit size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                id={`delete-assumption-${assumption._id}`}
                size="small"
                onClick={() => onDelete(assumption._id)}
                sx={{
                  color: '#ef4444',
                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.12)' },
                }}
              >
                <MdDelete size={18} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default AssumptionRow;
