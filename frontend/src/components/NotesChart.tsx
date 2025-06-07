import React, { useMemo } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { Note } from '../types';
import { motion } from 'framer-motion';

interface NotesChartProps {
  notes: Note[];
}

const MotionBox = motion(Box);

export const NotesChart: React.FC<NotesChartProps> = ({ notes }) => {
  const theme = useTheme();

  const stats = useMemo(() => {
    const total = notes.length;
    const active = notes.filter((note) => note.status === 'active').length;
    const completed = notes.filter((note) => note.status === 'completed').length;
    const archived = notes.filter((note) => note.status === 'archived').length;

    return {
      total,
      active,
      completed,
      archived,
      activePercentage: total ? Math.round((active / total) * 100) : 0,
      completedPercentage: total ? Math.round((completed / total) * 100) : 0,
      archivedPercentage: total ? Math.round((archived / total) * 100) : 0,
    };
  }, [notes]);

  const chartData = [
    {
      label: 'Active',
      value: stats.active,
      percentage: stats.activePercentage,
      color: theme.palette.primary.main,
    },
    {
      label: 'Completed',
      value: stats.completed,
      percentage: stats.completedPercentage,
      color: theme.palette.success.main,
    },
    {
      label: 'Archived',
      value: stats.archived,
      percentage: stats.archivedPercentage,
      color: theme.palette.grey[500],
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Notes Overview
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <MotionBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            minWidth: 120,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            {stats.total}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
            Total Notes
          </Typography>
        </MotionBox>

        {chartData.map((item, index) => (
          <MotionBox
            key={item.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(item.color, 0.1),
              minWidth: 120,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: `${item.percentage}%`,
                height: 3,
                backgroundColor: item.color,
                transition: 'width 0.5s ease',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                {item.value}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha(item.color, 0.7) }}>
                {item.percentage}%
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
              {item.label}
            </Typography>
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}; 