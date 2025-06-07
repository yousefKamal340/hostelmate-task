import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { Note } from '../types';
import { useToken } from './TokenContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

interface NotesContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  isLoading: boolean;
  createNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useToken();

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.sort((a: Note, b: Note) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (note: Partial<Note>): Promise<Note> => {
    const response = await axios.post(
      `${API_BASE_URL}/notes`,
      note,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const newNote = response.data;
    setNotes((prev) => [...prev, newNote]);
    return newNote;
  };

  const updateNote = async (id: string, note: Partial<Note>): Promise<void> => {
    await axios.patch(
      `${API_BASE_URL}/notes/${id}`,
      note,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, ...note } : n))
    );
  };

  const deleteNote = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}; 