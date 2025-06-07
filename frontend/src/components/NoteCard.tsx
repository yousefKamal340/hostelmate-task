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
import { ChromePicker } from 'react-color';
import { Note } from '../types';
import { useColorPicker } from '../hooks/useColorPicker';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, note: Partial<Note>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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

export const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    theme,
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
  } = useColorPicker(note._id, note.theme);

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    await onUpdate(note._id, editedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNote(note);
    setIsEditing(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'archived') => {
    await onUpdate(note._id, { ...note, status: newStatus });
    handleMenuClose();
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

  const getCardStyle = () => {
    const style: React.CSSProperties = {
      position: 'relative',
      borderRadius: theme.borderRadius ?? 8,
      color: theme.textColor,
      transition: 'all 0.3s ease',
    };

    if (theme.useGradient) {
      style.background = `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`;
    } else {
      style.backgroundColor = theme.backgroundColor;
    }

    return style;
  };

  return (
    <>
      <Card
        sx={{
          ...getCardStyle(),
          boxShadow: theme.elevation ?? 2,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme.elevation ?? 2) + 2,
          },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent>
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              label={statusLabels[note.status]}
              sx={{
                backgroundColor: statusColors[note.status],
                color: 'white',
                fontWeight: 500,
              }}
            />
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {isEditing ? (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
              <TextField
                fullWidth
                label="Title"
                value={editedNote.title}
                onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={editedNote.content}
                onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                variant="outlined"
                size="small"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="small" onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, mb: 2 }}>
                {note.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {note.content}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Customize Theme" arrow TransitionComponent={Fade}>
                    <IconButton onClick={openPicker} size="small">
                      <PaletteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {note.status !== 'archived' && (
          <MenuItem onClick={() => handleStatusChange('archived')}>
            <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Archive
          </MenuItem>
        )}
        {note.status === 'archived' && (
          <MenuItem onClick={() => handleStatusChange('active')}>
            <UnarchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Unarchive
          </MenuItem>
        )}
        {note.status !== 'completed' && (
          <MenuItem onClick={() => handleStatusChange('completed')}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Completed
          </MenuItem>
        )}
        {note.status === 'completed' && (
          <MenuItem onClick={() => handleStatusChange('active')}>
            <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Active
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={isDeleting}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 