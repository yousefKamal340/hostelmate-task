import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { Theme } from '../types';

interface ColorPickerProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => Promise<void>;
}

const defaultTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  useGradient: false,
  borderRadius: 16,
  elevation: 4,
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  open,
  onClose,
  theme,
  onThemeChange,
}) => {
  const [localTheme, setLocalTheme] = React.useState<Theme>({
    ...defaultTheme,
    ...theme,
  });
  const [isPickingText, setIsPickingText] = React.useState(false);
  const [isPickingGradient, setIsPickingGradient] = React.useState<'start' | 'end' | false>(false);

  React.useEffect(() => {
    setLocalTheme({
      ...defaultTheme,
      ...theme,
    });
  }, [theme]);

  const handleColorChange = (color: any) => {
    const { r, g, b, a } = color.rgb;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    setLocalTheme((prev) => {
      if (isPickingText) {
        return { ...prev, textColor: rgbaColor };
      } else if (isPickingGradient) {
        return {
          ...prev,
          [isPickingGradient === 'start' ? 'gradientStart' : 'gradientEnd']: rgbaColor,
        };
      } else {
        return { ...prev, backgroundColor: rgbaColor };
      }
    });
  };

  const handleSave = async () => {
    try {
      await onThemeChange(localTheme);
      onClose();
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleCancel = () => {
    setLocalTheme(theme);
    onClose();
  };

  const handleBorderRadiusChange = (event: Event, newValue: number | number[]) => {
    setLocalTheme((prev) => ({ ...prev, borderRadius: newValue as number }));
  };

  const handleElevationChange = (event: Event, newValue: number | number[]) => {
    setLocalTheme((prev) => ({ ...prev, elevation: newValue as number }));
  };

  const handleGradientToggle = () => {
    setLocalTheme((prev) => ({ ...prev, useGradient: !prev.useGradient }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { 
          minWidth: 350,
          maxWidth: 'min(90vw, 500px)',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>Customize Theme</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography gutterBottom>
              {isPickingText ? 'Text Color' : isPickingGradient ? `Gradient ${isPickingGradient} Color` : 'Background Color'}
            </Typography>
            <ChromePicker
              color={
                isPickingText
                  ? localTheme.textColor
                  : isPickingGradient
                  ? isPickingGradient === 'start'
                    ? localTheme.gradientStart || localTheme.backgroundColor
                    : localTheme.gradientEnd || '#ffffff'
                  : localTheme.backgroundColor
              }
              onChange={handleColorChange}
              styles={{
                default: {
                  picker: {
                    width: '100%',
                    boxShadow: 'none',
                    borderRadius: 8,
                  },
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant={isPickingText ? 'contained' : 'outlined'}
              onClick={() => {
                setIsPickingText(!isPickingText);
                setIsPickingGradient(false);
              }}
              fullWidth
            >
              Text Color
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={localTheme.useGradient}
                  onChange={handleGradientToggle}
                />
              }
              label="Use Gradient"
            />
          </Stack>

          {localTheme.useGradient && (
            <Stack direction="row" spacing={2}>
              <Button
                variant={isPickingGradient === 'start' ? 'contained' : 'outlined'}
                onClick={() => {
                  setIsPickingGradient(isPickingGradient === 'start' ? false : 'start');
                  setIsPickingText(false);
                }}
                fullWidth
              >
                Start Color
              </Button>
              <Button
                variant={isPickingGradient === 'end' ? 'contained' : 'outlined'}
                onClick={() => {
                  setIsPickingGradient(isPickingGradient === 'end' ? false : 'end');
                  setIsPickingText(false);
                }}
                fullWidth
              >
                End Color
              </Button>
            </Stack>
          )}

          <Box>
            <Typography gutterBottom>Border Radius</Typography>
            <Slider
              value={localTheme.borderRadius}
              onChange={handleBorderRadiusChange}
              min={0}
              max={24}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>Elevation</Typography>
            <Slider
              value={localTheme.elevation}
              onChange={handleElevationChange}
              min={0}
              max={24}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: localTheme.borderRadius,
              bgcolor: localTheme.useGradient
                ? `linear-gradient(135deg, ${localTheme.gradientStart || localTheme.backgroundColor}, ${localTheme.gradientEnd || '#ffffff'})`
                : localTheme.backgroundColor,
              color: localTheme.textColor,
              boxShadow: `0px ${localTheme.elevation}px ${localTheme.elevation * 2}px rgba(0,0,0,0.1)`,
            }}
          >
            <Typography>Preview Text</Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 