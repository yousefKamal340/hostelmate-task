import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../types';
import { useColorPicker } from '../hooks/useColorPicker';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, note: Partial<Note>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const { theme, isOpen, openPicker, closePicker, handleColorChange, toggleTextColor } =
    useColorPicker(note.theme);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(note._id, editedNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleCancel = () => {
    setEditedNote(note);
    setIsEditing(false);
  };

  const handleThemeUpdate = async () => {
    try {
      await onUpdate(note._id, { theme });
      closePicker();
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <Card
        sx={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardContent>
          {isEditing ? (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={editedNote.title}
                onChange={(e) =>
                  setEditedNote((prev) => ({ ...prev, title: e.target.value }))
                }
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Content"
                value={editedNote.content}
                onChange={(e) =>
                  setEditedNote((prev) => ({ ...prev, content: e.target.value }))
                }
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
              <TextField
                select
                label="Status"
                value={editedNote.status}
                onChange={(e) =>
                  setEditedNote((prev) => ({ ...prev, status: e.target.value as Note['status'] }))
                }
                fullWidth
                size="small"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCancel} color="inherit">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h6" component="h2" gutterBottom>
                {note.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {note.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Status: {note.status}
              </Typography>
            </>
          )}
        </CardContent>

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <IconButton size="small" onClick={openPicker}>
            <PaletteIcon />
          </IconButton>
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(note._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Dialog open={isOpen} onClose={closePicker}>
          <Box sx={{ p: 2 }}>
            <ChromePicker
              color={theme[isPickingText ? 'textColor' : 'backgroundColor']}
              onChange={handleColorChange}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={toggleTextColor}>
                {isPickingText ? 'Pick Background' : 'Pick Text Color'}
              </Button>
              <Button onClick={handleThemeUpdate} variant="contained" color="primary">
                Apply Theme
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Card>
    </motion.div>
  );
}; 