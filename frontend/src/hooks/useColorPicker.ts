import { useState, useCallback } from 'react';
import { Theme } from '../types';

interface UseColorPickerResult {
  theme: Theme;
  isOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  handleColorChange: (color: { hex: string }) => void;
  toggleTextColor: () => void;
}

const defaultTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

export const useColorPicker = (initialTheme: Theme = defaultTheme): UseColorPickerResult => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isOpen, setIsOpen] = useState(false);
  const [isPickingText, setIsPickingText] = useState(false);

  const openPicker = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setIsOpen(false);
    setIsPickingText(false);
  }, []);

  const handleColorChange = useCallback(({ hex }: { hex: string }) => {
    setTheme((prev) => ({
      ...prev,
      [isPickingText ? 'textColor' : 'backgroundColor']: hex,
    }));
  }, [isPickingText]);

  const toggleTextColor = useCallback(() => {
    setIsPickingText((prev) => !prev);
  }, []);

  return {
    theme,
    isOpen,
    openPicker,
    closePicker,
    handleColorChange,
    toggleTextColor,
  };
}; 