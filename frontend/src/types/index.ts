export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  gradientStart?: string;
  gradientEnd?: string;
  useGradient?: boolean;
  borderRadius?: number;
  elevation?: number;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  theme?: Theme;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  order: number;
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