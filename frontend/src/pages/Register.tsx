import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
  alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export const Register: React.FC = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ width: '100%' }}
        >
          <MotionPaper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Account
            </Typography>

            {error && (
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </MotionBox>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Typography variant="body2" align="center" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>
                  Sign in
                </Link>
              </Typography>
            </form>
          </MotionPaper>
        </MotionBox>
      </Box>
    </Container>
  );
}; 