import { useState, useCallback, useEffect } from 'react';
import { Theme } from '../types';

interface UseColorPickerResult {
  theme: Theme;
  isOpen: boolean;
  isPickingText: boolean;
  isPickingGradient: 'start' | 'end' | false;
  openPicker: () => void;
  closePicker: () => void;
  handleColorChange: (color: { hex: string }) => void;
  toggleTextColor: () => void;
  toggleGradient: (type: 'start' | 'end') => void;
  handleBorderRadiusChange: (value: number) => void;
  handleElevationChange: (value: number) => void;
  saveTheme: () => void;
}

const defaultTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  gradientStart: '#ffffff',
  gradientEnd: '#f0f0f0',
  useGradient: false,
  borderRadius: 8,
  elevation: 2,
};

const THEME_STORAGE_KEY = 'notemate-themes';

export const useColorPicker = (noteId: string, initialTheme: Theme = defaultTheme): UseColorPickerResult => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedThemes = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemes) {
      const themes = JSON.parse(savedThemes);
      return themes[noteId] || initialTheme;
    }
    return initialTheme;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPickingText, setIsPickingText] = useState(false);
  const [isPickingGradient, setIsPickingGradient] = useState<'start' | 'end' | false>(false);

  const openPicker = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsOpen(false);
    setIsPickingText(false);
    setIsPickingGradient(false);
  }, []);

  const handleColorChange = useCallback(({ hex }: { hex: string }) => {
    setTheme((prev) => {
      if (isPickingText) {
        return { ...prev, textColor: hex };
      } else if (isPickingGradient) {
        return {
          ...prev,
          [isPickingGradient === 'start' ? 'gradientStart' : 'gradientEnd']: hex,
        };
      } else {
        return { ...prev, backgroundColor: hex };
      }
    });
  }, [isPickingText, isPickingGradient]);

  const toggleTextColor = useCallback(() => {
    setIsPickingText(prev => !prev);
    setIsPickingGradient(false);
  }, []);

  const toggleGradient = useCallback((type: 'start' | 'end') => {
    setIsPickingGradient(prev => prev === type ? false : type);
    setIsPickingText(false);
    setTheme(prev => ({ ...prev, useGradient: true }));
  }, []);

  const handleBorderRadiusChange = useCallback((value: number) => {
    setTheme(prev => ({ ...prev, borderRadius: value }));
  }, []);

  const handleElevationChange = useCallback((value: number) => {
    setTheme(prev => ({ ...prev, elevation: value }));
  }, []);

  const saveTheme = useCallback(() => {
    const savedThemes = localStorage.getItem(THEME_STORAGE_KEY);
    const themes = savedThemes ? JSON.parse(savedThemes) : {};
    themes[noteId] = theme;
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themes));
  }, [noteId, theme]);

  useEffect(() => {
    saveTheme();
  }, [theme, saveTheme]);

  return {
    theme,
    isOpen,
    isPickingText,
    isPickingGradient,
    openPicker,
    closePicker,
    handleColorChange,
    toggleTextColor,
    toggleGradient,
    handleBorderRadiusChange,
    handleElevationChange,
    saveTheme,
  };
}; 