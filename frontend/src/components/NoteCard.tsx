import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Stack,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Fade,
  Divider,
  alpha,
  FormHelperText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
  MoreVert as MoreVertIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Note, Theme } from '../types';
import { useColorPicker } from '../hooks/useColorPicker';
import { format } from 'date-fns';
import { ColorPicker } from './ColorPicker';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => Promise<void>;
  onUpdateTheme: (id: string, theme: Theme) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: 'active' | 'completed' | 'archived') => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

interface ValidationError {
  path: string;
  msg: string;
}

interface ApiError {
  response?: {
    data?: {
      errors?: ValidationError[];
    };
  };
}

const statusColors = {
  active: '#2196f3',
  completed: '#4caf50',
  archived: '#9e9e9e',
};

const statusLabels = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

const defaultTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  useGradient: false,
  borderRadius: 16,
  elevation: 4,
};

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const getCardStyle = (theme: Theme, status: string, isHovered: boolean) => {
  const style: React.CSSProperties = {
    position: 'relative',
    borderRadius: 0,
    color: theme.textColor,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: theme.useGradient
      ? `linear-gradient(135deg, ${theme.gradientStart || theme.backgroundColor}, ${theme.gradientEnd || '#ffffff'})`
      : theme.backgroundColor,
    boxShadow: isHovered 
      ? `0px ${theme.elevation * 1.5}px ${theme.elevation * 3}px ${alpha('#000000', 0.15)}`
      : `0px ${theme.elevation}px ${theme.elevation * 2}px ${alpha('#000000', 0.1)}`,
    cursor: 'default',
    opacity: status === 'completed' ? 0.8 : 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha(theme.textColor, 0.1)}`,
  };

  return style;
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onUpdate,
  onUpdateTheme,
  onDelete,
  onStatusChange,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const theme: Theme = {
    ...defaultTheme,
    ...note.theme,
  };

  const {
    isOpen,
    isPickingText,
    isPickingGradient,
    openPicker,
    closePicker,
    handleColorChange,
    toggleTextColor,
    toggleGradient,
    handleBorderRadiusChange,
    handleElevationChange,
  } = useColorPicker(note._id, theme);

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const validateNote = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!editedNote.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!editedNote.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateNote()) {
      return;
    }
    
    try {
      await onUpdate(note._id, {
        title: editedNote.title,
        content: editedNote.content,
      });
      setIsEditing(false);
      setErrors({});
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.errors) {
        const serverErrors = apiError.response.data.errors.reduce((acc: Record<string, string>, err: ValidationError) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        setErrors(serverErrors);
      }
    }
  };

  const handleCancel = () => {
    setEditedNote(note);
    setIsEditing(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleStatusChange = async (status: 'active' | 'completed' | 'archived') => {
    try {
      await onUpdate(note._id, { status });
      handleMenuClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    await onDelete(note._id);
    setIsDeleting(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
  };

  const handleThemeChange = async (newTheme: Theme) => {
    await onUpdateTheme(note._id, newTheme);
  };

  const handleResetTheme = async () => {
    try {
      await onUpdateTheme(note._id, defaultTheme);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to reset theme:', error);
    }
  };

  return (
    <>
      <Card
        sx={{
          ...getCardStyle(theme, note.status, isHovered),
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
          '& .MuiCardContent-root': {
            borderRadius: 0,
          },
        }}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <MotionBox
          sx={{ height: '100%' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          layout
        >
          <CardContent sx={{ 
            flexGrow: 1, 
            p: 3,
            '&:last-child': { pb: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              display: 'flex', 
              gap: 1,
              zIndex: 1
            }}>
              <Chip
                size="small"
                label={statusLabels[note.status]}
                sx={{
                  backgroundColor: alpha(statusColors[note.status], 0.9),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease',
                  px: 1,
                  '&:hover': {
                    backgroundColor: statusColors[note.status],
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  backgroundColor: alpha(theme.textColor, 0.08),
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.textColor, 0.15),
                    transform: 'rotate(90deg)',
                  },
                }}
              >
                <MoreVertIcon sx={{ color: theme.textColor }} />
              </IconButton>
            </Box>

            <Box sx={{ mt: 4, mb: 2, flex: 1 }}>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    value={editedNote.title}
                    onChange={(e) => {
                      setEditedNote({ ...editedNote, title: e.target.value });
                      if (errors.title) {
                        setErrors({ ...errors, title: undefined });
                      }
                    }}
                    variant="standard"
                    placeholder="Note Title"
                    sx={{
                      mb: 2,
                      '& .MuiInput-root': {
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: theme.textColor,
                        '&:before, &:after': {
                          borderColor: alpha(theme.textColor, 0.2),
                        },
                        '&:hover:not(.Mui-disabled):before': {
                          borderColor: alpha(theme.textColor, 0.3),
                        },
                        '&.Mui-focused:after': {
                          borderColor: theme.textColor,
                        },
                      },
                    }}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={editedNote.content}
                    onChange={(e) => {
                      setEditedNote({ ...editedNote, content: e.target.value });
                      if (errors.content) {
                        setErrors({ ...errors, content: undefined });
                      }
                    }}
                    variant="standard"
                    placeholder="Note Content"
                    sx={{
                      mb: 2,
                      '& .MuiInput-root': {
                        color: theme.textColor,
                        '&:before, &:after': {
                          borderColor: alpha(theme.textColor, 0.2),
                        },
                        '&:hover:not(.Mui-disabled):before': {
                          borderColor: alpha(theme.textColor, 0.3),
                        },
                        '&.Mui-focused:after': {
                          borderColor: theme.textColor,
                        },
                      },
                    }}
                    error={Boolean(errors.content)}
                    helperText={errors.content}
                  />
                </>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.textColor,
                      opacity: 0.9,
                      mb: 2,
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: alpha(theme.textColor, 0.8),
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.6,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {note.content}
                  </Typography>
                </>
              )}
            </Box>

            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${alpha(theme.textColor, 0.1)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.textColor, 0.6),
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                }}
              >
                {format(new Date(note.createdAt), 'MMM d, yyyy')}
              </Typography>

              {isEditing && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={handleCancel}
                    sx={{
                      color: alpha(theme.textColor, 0.8),
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: alpha(theme.textColor, 0.1),
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                      backgroundColor: theme.textColor,
                      color: theme.backgroundColor,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: alpha(theme.textColor, 0.85),
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </MotionBox>
      </Card>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 0,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: 200,
            border: '1px solid rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)',
          },
          '& .MuiMenuItem-root': {
            py: 1.5,
            px: 2,
            gap: 1.5,
            borderRadius: 0,
            mx: 0,
            '&:hover': {
              backgroundColor: alpha(theme.textColor, 0.08),
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ fontSize: 20 }} />
          Edit Note
        </MenuItem>
        <MenuItem onClick={() => setIsColorPickerOpen(true)}>
          <PaletteIcon sx={{ fontSize: 20 }} />
          Customize Theme
        </MenuItem>
        <MenuItem onClick={handleResetTheme}>
          <RefreshIcon sx={{ fontSize: 20 }} />
          Reset Theme
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        {note.status !== 'completed' && (
          <MenuItem onClick={() => handleStatusChange('completed')}>
            <CheckCircleIcon sx={{ fontSize: 20 }} />
            Mark as Completed
          </MenuItem>
        )}
        {note.status !== 'archived' && (
          <MenuItem onClick={() => handleStatusChange('archived')}>
            <ArchiveIcon sx={{ fontSize: 20 }} />
            Archive Note
          </MenuItem>
        )}
        {note.status === 'archived' && (
          <MenuItem onClick={() => handleStatusChange('active')}>
            <UnarchiveIcon sx={{ fontSize: 20 }} />
            Unarchive Note
          </MenuItem>
        )}
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleDeleteClick} 
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.dark',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
          Delete Note
        </MenuItem>
      </Menu>

      <Dialog
        open={isDeleting}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this note? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ColorPicker
        open={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
    </>
  );
}; 