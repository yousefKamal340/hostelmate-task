import React from 'react';
import { Grid, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../types';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onUpdateNote: (id: string, note: Partial<Note>) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onUpdateNote,
  onDeleteNote,
}) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <AnimatePresence>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
              <NoteCard
                note={note}
                onUpdate={onUpdateNote}
                onDelete={onDeleteNote}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}; 