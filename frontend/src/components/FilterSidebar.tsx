import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  useTheme,
  alpha,
  Button,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  FilterList as FilterIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface FilterSidebarProps {
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

const MotionBox = motion(Box);
const DRAWER_WIDTH = 320;

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const theme = useTheme();
  const { logout } = useAuth();

  const handleStatusChange = (event: any) => {
    onFilterChange({
      ...filters,
      status: event.target.value,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchQuery: event.target.value,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: date ? date.toISOString() : '',
      },
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: date ? date.toISOString() : '',
      },
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      dateRange: {
        start: '',
        end: '',
      },
      searchQuery: '',
    });
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <MotionBox
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" component="h2">
            Filter Notes
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Search Notes"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              },
            }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              label="Status"
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.7 }}>
              Date Range
            </Typography>
            <Stack spacing={2}>
              <DatePicker
                label="Start Date"
                value={filters.dateRange.start ? new Date(filters.dateRange.start) : null}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.7),
                      },
                      '&.Mui-focused': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      },
                    },
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={filters.dateRange.end ? new Date(filters.dateRange.end) : null}
                onChange={handleEndDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.7),
                      },
                      '&.Mui-focused': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      },
                    },
                  },
                }}
              />
            </Stack>
          </Box>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
            fullWidth
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              backdropFilter: 'blur(4px)',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Clear Filters
          </Button>
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.1 }} />
        
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            mt: 'auto',
            backdropFilter: 'blur(4px)',
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          Logout
        </Button>
      </MotionBox>
    </Drawer>
  );
}; 