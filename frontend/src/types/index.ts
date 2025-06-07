export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  elevation: number;
  useGradient?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  status: 'active' | 'completed' | 'archived';
  theme?: Theme;
  order: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
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