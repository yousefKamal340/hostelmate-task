import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Note } from '../types';

interface NotesChartProps {
  notes: Note[];
}

interface ChartSegment {
  status: string;
  count: number;
  color: string;
  startAngle: number;
  endAngle: number;
}

export const NotesChart: React.FC<NotesChartProps> = ({ notes }) => {
  const theme = useTheme();
  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.8;

  const segments = useMemo(() => {
    const statusCounts = notes.reduce((acc, note) => {
      acc[note.status] = (acc[note.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    let currentAngle = 0;

    const colors = {
      active: theme.palette.primary.main,
      completed: theme.palette.success.main,
      archived: theme.palette.grey[500],
    };

    return Object.entries(statusCounts).map(([status, count]): ChartSegment => {
      const percentage = count / total;
      const startAngle = currentAngle;
      const endAngle = currentAngle + percentage * 2 * Math.PI;
      currentAngle = endAngle;

      return {
        status,
        count,
        color: colors[status as keyof typeof colors],
        startAngle,
        endAngle,
      };
    });
  }, [notes, theme]);

  const getPathData = (segment: ChartSegment) => {
    const startX = centerX + radius * Math.cos(segment.startAngle);
    const startY = centerY + radius * Math.sin(segment.startAngle);
    const endX = centerX + radius * Math.cos(segment.endAngle);
    const endY = centerY + radius * Math.sin(segment.endAngle);

    const largeArcFlag = segment.endAngle - segment.startAngle > Math.PI ? 1 : 0;

    return `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Notes by Status
      </Typography>
      <Box sx={{ position: 'relative', width: size, height: size, margin: 'auto' }}>
        <svg width={size} height={size}>
          {segments.map((segment, index) => (
            <g key={segment.status}>
              <path
                d={getPathData(segment)}
                fill={segment.color}
                stroke={theme.palette.background.paper}
                strokeWidth="2"
              >
                <title>{`${segment.status}: ${segment.count} notes`}</title>
              </path>
            </g>
          ))}
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          {segments.map((segment) => (
            <Box
              key={segment.status}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: segment.color,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption">
                {segment.status} ({segment.count})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 