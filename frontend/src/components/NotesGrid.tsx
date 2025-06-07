import React, { useState, useCallback } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { NotesChart } from './NotesChart';
import { debounce } from 'lodash';
import { Theme } from '../types';

interface NotesGridProps {
  notes: Note[];
  onUpdateNote: (id: string, note: Partial<Note>) => Promise<void>;
  onUpdateTheme: (id: string, theme: Theme) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  onReorderNotes: (notes: Note[]) => Promise<void>;
  onStatusChange: (id: string, status: 'active' | 'completed' | 'archived') => void;
}

const MotionBox = motion(Box);

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onUpdateNote,
  onUpdateTheme,
  onDeleteNote,
  onReorderNotes,
  onStatusChange,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOverNote, setDragOverNote] = useState<string | null>(null);

  // Debounce the reorder callback to prevent too many API calls
  const debouncedReorder = useCallback(
    debounce(async (reorderedNotes: Note[]) => {
      try {
        await onReorderNotes(reorderedNotes);
      } catch (error) {
        console.error('Failed to update note order:', error);
      }
    }, 500),
    [onReorderNotes]
  );

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    setIsDragging(true);
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag preview transparent
    const dragPreview = document.createElement('div');
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedNote(null);
    setDragOverNote(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedNote === noteId) return;
    setDragOverNote(noteId);
  }, [draggedNote]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedNote || draggedNote === targetId) return;

    const sourceIndex = notes.findIndex(note => note._id === draggedNote);
    const targetIndex = notes.findIndex(note => note._id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newNotes = [...notes];
    const [movedNote] = newNotes.splice(sourceIndex, 1);
    newNotes.splice(targetIndex, 0, movedNote);

    const updatedNotes = newNotes.map((note, index) => ({
      ...note,
      order: index,
    }));

    debouncedReorder(updatedNotes);
    setDragOverNote(null);
  }, [draggedNote, notes, debouncedReorder]);

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <NotesChart notes={notes} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(auto-fit, minmax(280px, 1fr))',
            sm: 'repeat(auto-fit, minmax(300px, 1fr))',
            md: 'repeat(auto-fit, minmax(320px, 1fr))',
            lg: 'repeat(auto-fit, minmax(350px, 1fr))',
          },
          width: '100%',
          position: 'relative',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          '& > *': {
            minWidth: 0, // Prevent grid items from overflowing
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <MotionBox
              key={note._id}
              draggable
              onDragStart={(e: any) => handleDragStart(e, note._id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e: any) => handleDragOver(e, note._id)}
              onDrop={(e: any) => handleDrop(e, note._id)}
              initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateX: 0,
                y: isDragging && draggedNote === note._id ? -10 : 0,
                boxShadow: isDragging && draggedNote === note._id 
                  ? '0 20px 40px rgba(0,0,0,0.2)' 
                  : '0 8px 16px rgba(0,0,0,0.1)',
              }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              sx={{
                transform: dragOverNote === note._id ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s ease',
                width: '100%',
                height: '100%',
              }}
            >
              <NoteCard
                note={note}
                onUpdate={onUpdateNote}
                onUpdateTheme={onUpdateTheme}
                onDelete={onDeleteNote}
                onStatusChange={onStatusChange}
              />
            </MotionBox>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}; 