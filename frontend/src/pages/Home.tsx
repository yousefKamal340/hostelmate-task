import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { NotesGrid } from '../components/NotesGrid';
import { CreateNoteDialog } from '../components/CreateNoteDialog';
import { FilterSidebar } from '../components/FilterSidebar';

const DRAWER_WIDTH = 320;
const MAX_CONTENT_WIDTH = 1600; // Maximum width for centered content

interface Filters {
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  searchQuery: string;
}

export const Home: React.FC = () => {
  const theme = useTheme();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    dateRange: {
      start: '',
      end: '',
    },
    searchQuery: '',
  });
  const [error, setError] = useState<string | null>(null);
  
  const { notes, createNote, updateNote, updateNoteTheme, deleteNote, updateNotesOrder } = useNotes();

  const handleStatusChange = async (noteId: string, status: 'active' | 'completed' | 'archived') => {
    try {
      await updateNote(noteId, { status });
    } catch (err) {
      setError('Failed to update note status');
    }
  };

  const handleAddNote = async (note: Partial<Note>) => {
    try {
      await createNote(note);
      setIsAddingNote(false);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesStatus = filters.status === 'all' || note.status === filters.status;
    const matchesSearch = !filters.searchQuery || 
      note.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(filters.searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            NoteMate
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingNote(true)}
          >
            Add Note
          </Button>
        </Toolbar>
      </AppBar>

      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          // ml: `${DRAWER_WIDTH}px`,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: MAX_CONTENT_WIDTH,
            mx: 'auto',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <NotesGrid
            notes={filteredNotes}
            onUpdateNote={updateNote}
            onUpdateTheme={updateNoteTheme}
            onDeleteNote={deleteNote}
            onReorderNotes={updateNotesOrder}
            onStatusChange={handleStatusChange}
          />
        </Box>
      </Box>

      <CreateNoteDialog
        open={isAddingNote}
        onClose={() => setIsAddingNote(false)}
        onSubmit={handleAddNote}
      />
    </Box>
  );
}; 