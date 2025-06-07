import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { Note, NotesState } from '../types';
import { useAuth } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface NotesContextType extends NotesState {
  fetchNotes: () => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  updateNoteOrder: (id: string, newOrder: number) => Promise<Note>;
}

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
};

type NotesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Note[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'CREATE_SUCCESS'; payload: Note }
  | { type: 'UPDATE_SUCCESS'; payload: Note }
  | { type: 'DELETE_SUCCESS'; payload: string }
  | { type: 'REORDER_SUCCESS'; payload: Note };

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    case 'REORDER_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
      };
    default:
      return state;
  }
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchNotes = async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      const response = await axiosInstance.get<Note[]>('/notes');
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notes';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    try {
      const response = await axiosInstance.post<Note>('/notes', note);
      dispatch({ type: 'CREATE_SUCCESS', payload: response.data });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create note';
      throw new Error(message);
    }
  };

  const updateNote = async (id: string, note: Partial<Note>) => {
    try {
      const response = await axiosInstance.patch<Note>(`/notes/${id}`, note);
      dispatch({ type: 'UPDATE_SUCCESS', payload: response.data });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update note';
      throw new Error(message);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete note';
      throw new Error(message);
    }
  };

  const updateNoteOrder = async (id: string, newOrder: number) => {
    try {
      const response = await axiosInstance.patch<Note>(`/notes/${id}/order`, {
        newOrder,
      });
      dispatch({ type: 'REORDER_SUCCESS', payload: response.data });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update note order';
      throw new Error(message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  return (
    <NotesContext.Provider
      value={{
        ...state,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        updateNoteOrder,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}; 