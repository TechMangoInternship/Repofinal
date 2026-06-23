import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { MdInbox } from 'react-icons/md';
import DependencyRow from './DependencyRow';

const DependencyGrid = ({ dependencies, onUpdate, onDelete }) => {
  if (dependencies.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          gap: 1.5,
          opacity: 0.5,
        }}
      >
        <MdInbox size={48} />
        <Typography variant="body1" color="text.secondary">
          No dependencies found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first dependency above
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '16px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'rgba(14, 165, 233, 0.08)',
            }}
          >
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
                width: 60,
              }}
            >
              #
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
              }}
            >
              Dependency
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
                width: 120,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dependencies.map((item, index) => (
            <DependencyRow
              key={item._id}
              dependency={item}
              index={index}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DependencyGrid;
