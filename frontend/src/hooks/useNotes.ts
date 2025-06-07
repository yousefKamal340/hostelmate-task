import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Note, Theme } from '../types';
import { useToken } from '../context/TokenContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface UseNotesResult {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  isLoading: boolean;
  error: Error | null;
  createNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  updateNoteTheme: (id: string, theme: Theme) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNoteOrder: (id: string, newOrder: number) => Promise<void>;
  updateNotesOrder: (notes: Note[]) => Promise<void>;
  fetchNotes: () => Promise<void>;
}

export const useNotes = (): UseNotesResult => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useToken();

  const fetchNotes = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.sort((a: Note, b: Note) => a.order - b.order));
    } catch (err) {
      setError(err as Error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (note: Partial<Note>): Promise<Note> => {
    if (!token) throw new Error('No authentication token found');

    try {
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
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [token]);

  const updateNote = useCallback(async (id: string, note: Partial<Note>): Promise<void> => {
    if (!token) throw new Error('No authentication token found');

    try {
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
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [token]);

  const updateNoteTheme = useCallback(async (id: string, theme: Theme): Promise<void> => {
    if (!token) throw new Error('No authentication token found');

    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${id}/theme`,
        { theme },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, theme } : n))
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [token]);

  const updateNoteOrder = useCallback(async (id: string, newOrder: number): Promise<void> => {
    if (!token) throw new Error('No authentication token found');

    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${id}/order`,
        { newOrder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Don't update local state here as we'll fetch fresh data
      await fetchNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [token, fetchNotes]);

  const updateNotesOrder = useCallback(async (updatedNotes: Note[]): Promise<void> => {
    if (!token) throw new Error('No authentication token found');

    try {
      // Update local state immediately for better UX
      setNotes(updatedNotes);

      // Send the updates to the server
      await Promise.all(
        updatedNotes.map((note, index) =>
          axios.patch(
            `${API_BASE_URL}/notes/${note._id}/order`,
            { newOrder: index },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
    } catch (err) {
      // Revert local state on error
      setError(err as Error);
      await fetchNotes();
      throw err;
    }
  }, [token, fetchNotes]);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    if (!token) throw new Error('No authentication token found');

    try {
      await axios.delete(
        `${API_BASE_URL}/notes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [token]);

  return {
    notes,
    setNotes,
    isLoading,
    error,
    createNote,
    updateNote,
    updateNoteTheme,
    deleteNote,
    updateNoteOrder,
    updateNotesOrder,
    fetchNotes,
  };
}; 