import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { NotesChart } from './NotesChart';
import { FilterSidebar } from './FilterSidebar';
import { debounce } from 'lodash';

interface NotesGridProps {
  notes: Note[];
  onUpdateNote: (id: string, note: Partial<Note>) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  onReorderNotes: (notes: Note[]) => Promise<void>;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onUpdateNote,
  onDeleteNote,
  onReorderNotes,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOverNote, setDragOverNote] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      start: '',
      end: '',
    },
    searchQuery: '',
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (filters.status && note.status !== filters.status) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (
          !note.title.toLowerCase().includes(query) &&
          !note.content.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (filters.dateRange.start || filters.dateRange.end) {
        const noteDate = new Date(note.createdAt);
        if (
          filters.dateRange.start &&
          noteDate < new Date(filters.dateRange.start)
        ) {
          return false;
        }
        if (
          filters.dateRange.end &&
          noteDate > new Date(filters.dateRange.end)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [notes, filters]);

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

    const sourceIndex = filteredNotes.findIndex(note => note._id === draggedNote);
    const targetIndex = filteredNotes.findIndex(note => note._id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newNotes = [...filteredNotes];
    const [movedNote] = newNotes.splice(sourceIndex, 1);
    newNotes.splice(targetIndex, 0, movedNote);

    const updatedNotes = newNotes.map((note, index) => ({
      ...note,
      order: index,
    }));

    debouncedReorder(updatedNotes);
    setDragOverNote(null);
  }, [draggedNote, filteredNotes, debouncedReorder]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <NotesChart notes={notes} />
      </Box>

      <FilterSidebar
        isOpen={isFilterOpen}
        onToggle={toggleFilter}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Box
        sx={{
          p: 3,
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(280px, 1fr))',
            sm: 'repeat(auto-fill, minmax(300px, 1fr))',
            md: 'repeat(auto-fill, minmax(320px, 1fr))',
            lg: 'repeat(auto-fill, minmax(350px, 1fr))',
          },
          width: '100%',
          position: 'relative',
          '& > *': {
            transition: 'transform 0.2s ease, opacity 0.2s ease',
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              layoutId={note._id}
              draggable
              onDragStart={(e: any) => handleDragStart(e as React.DragEvent<HTMLDivElement>, note._id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e: any) => handleDragOver(e as React.DragEvent<HTMLDivElement>, note._id)}
              onDrop={(e: any) => handleDrop(e as React.DragEvent<HTMLDivElement>, note._id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { type: 'spring', stiffness: 300, damping: 25 }
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'relative',
                gridColumn: 'span 1',
                cursor: isDragging ? (draggedNote === note._id ? 'grabbing' : 'grab') : 'grab',
              }}
            >
              <Box
                sx={{
                  transform: dragOverNote === note._id 
                    ? 'scale(1.05)' 
                    : draggedNote === note._id 
                    ? 'scale(0.95)' 
                    : 'scale(1)',
                  opacity: draggedNote === note._id ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  height: '100%',
                  position: 'relative',
                  '&::after': dragOverNote === note._id ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '2px dashed #1976d2',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                  } : {},
                }}
              >
                <NoteCard
                  note={note}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                />
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}; 