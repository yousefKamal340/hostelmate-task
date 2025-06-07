import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Note } from '../types';
import { useToken } from '../contexts/TokenContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export interface UseNotesResult {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  isLoading: boolean;
  error: Error | null;
  addNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotes = (): UseNotesResult => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useToken();

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.sort((a: Note, b: Note) => a.order - b.order));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = useCallback(async (note: Partial<Note>) => {
    // TODO: Implement API call
    const newNote = {
      _id: Date.now().toString(),
      ...note,
    } as Note;
    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback(async (id: string, note: Partial<Note>) => {
    // TODO: Implement API call
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, ...note } : n))
    );
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    // TODO: Implement API call
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }, []);

  return {
    notes,
    setNotes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
  };
}; 