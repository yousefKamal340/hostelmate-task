import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  useTheme,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
    searchQuery: string;
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
}) => {
  const theme = useTheme();

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, [type]: value },
    });
  };

  const handleSearchChange = (searchQuery: string) => {
    onFilterChange({ ...filters, searchQuery });
  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onToggle} size="small">
          <FilterIcon />
        </IconButton>
        <Typography variant="h6">Filters</Typography>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle2">Date Range</Typography>
        <TextField
          type="date"
          label="From"
          value={filters.dateRange.start}
          onChange={(e) => handleDateChange('start', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          type="date"
          label="To"
          value={filters.dateRange.end}
          onChange={(e) => handleDateChange('end', e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      <TextField
        label="Search"
        value={filters.searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        fullWidth
      />
    </Box>
  );

  return (
    <>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          top: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: theme.zIndex.drawer - 1,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          '&:hover': {
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <FilterIcon />
      </IconButton>

      <AnimatePresence>
        {isOpen && (
          <Drawer
            anchor="right"
            open={isOpen}
            onClose={onToggle}
            variant="temporary"
            PaperProps={{
              component: motion.div,
              initial: { x: 300 },
              animate: { x: 0 },
              exit: { x: 300 },
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}; 