import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { Note } from '../types';

interface CreateNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: Partial<Note>) => Promise<void>;
}

const defaultNote: Partial<Note> = {
  title: '',
  content: '',
  status: 'active',
  theme: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    useGradient: false,
    borderRadius: 8,
    elevation: 4,
  },
};

export const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = useState<Partial<Note>>(defaultNote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(note);
      setNote(defaultNote);
      onClose();
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNote(defaultNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={note.title}
            onChange={(e) => setNote((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={note.content}
            onChange={(e) => setNote((prev) => ({ ...prev, content: e.target.value }))}
            required
          />
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            value={note.status}
            onChange={(e) =>
              setNote((prev) => ({ ...prev, status: e.target.value as Note['status'] }))
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 