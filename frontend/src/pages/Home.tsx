import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Archive as ArchiveIcon,
  AllInbox as AllIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { NoteCard } from '../components/NoteCard';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';

type FilterStatus = 'all' | 'active' | 'completed' | 'archived';

export const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  useEffect(() => {
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  }, [isMobile]);

  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      await addNote({
        ...newNote,
        status: 'active',
        createdAt: new Date().toISOString(),
        theme: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          borderRadius: 8,
          elevation: 2,
        },
      });
      setNewNote({ title: '', content: '' });
      setIsAddingNote(false);
    }
  };

  const filteredNotes = notes
    .filter((note) => {
      if (filterStatus === 'all') return true;
      return note.status === filterStatus;
    })
    .filter((note) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });

  const drawerWidth = 240;

  const filterOptions = [
    { value: 'all', label: 'All Notes', icon: <AllIcon /> },
    { value: 'active', label: 'Active', icon: <FilterIcon /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircleIcon /> },
    { value: 'archived', label: 'Archived', icon: <ArchiveIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            background: theme.palette.background.default,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <List>
            {filterOptions.map((option) => (
              <ListItem
                key={option.value}
                onClick={() => setFilterStatus(option.value as FilterStatus)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  cursor: 'pointer',
                  backgroundColor: filterStatus === option.value ? 'primary.main' : 'transparent',
                  color: filterStatus === option.value ? 'primary.contrastText' : 'inherit',
                  '&:hover': {
                    backgroundColor: filterStatus === option.value ? 'primary.dark' : 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    color: filterStatus === option.value ? 'inherit' : 'text.secondary',
                  },
                }}
              >
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.label} />
                {filterStatus === option.value && (
                  <Chip
                    size="small"
                    label={filteredNotes.length}
                    sx={{
                      ml: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              My Notes
              {isMobile && (
                <IconButton
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  sx={{ ml: 1 }}
                >
                  <FilterIcon />
                </IconButton>
              )}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingNote(true)}
            >
              Add Note
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Box
              key={note._id}
              sx={{
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: '33.33%',
                  lg: '25%',
                },
                p: 1.5,
              }}
            >
              <Fade in>
                <div>
                  <NoteCard
                    note={note}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                  />
                </div>
              </Fade>
            </Box>
          ))}
          {filteredNotes.length === 0 && (
            <Box
              sx={{
                width: '100%',
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6">
                  {searchQuery
                    ? 'No notes match your search'
                    : filterStatus === 'all'
                    ? 'No notes yet. Create your first note!'
                    : `No ${filterStatus} notes`}
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Box>

      <Dialog
        open={isAddingNote}
        onClose={() => setIsAddingNote(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Note</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingNote(false)}>Cancel</Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!newNote.title.trim() || !newNote.content.trim()}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 