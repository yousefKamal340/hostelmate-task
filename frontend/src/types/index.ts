export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  theme: Theme;
  status: 'active' | 'archived' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 