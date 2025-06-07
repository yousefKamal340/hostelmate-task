import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Note } from '../models/note.model';
import { auth } from '../middleware/auth.middleware';

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

// Validation middleware for creating notes
const createNoteValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('theme.backgroundColor')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid background color format');
      }
      return true;
    }),
  body('theme.textColor')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid text color format');
      }
      return true;
    }),
  body('theme.useGradient').optional().isBoolean().withMessage('useGradient must be a boolean'),
  body('theme.gradientStart')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid gradient start color format');
      }
      return true;
    }),
  body('theme.gradientEnd')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid gradient end color format');
      }
      return true;
    }),
  body('theme.borderRadius').optional().isNumeric().withMessage('borderRadius must be a number'),
  body('theme.elevation').optional().isNumeric().withMessage('elevation must be a number'),
  body('status').optional().isIn(['active', 'archived', 'completed']).withMessage('Invalid status')
];

// Validation middleware for updating notes
const updateNoteValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty if provided'),
  body('theme.backgroundColor')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid background color format');
      }
      return true;
    }),
  body('theme.textColor')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid text color format');
      }
      return true;
    }),
  body('theme.useGradient').optional().isBoolean().withMessage('useGradient must be a boolean'),
  body('theme.gradientStart')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid gradient start color format');
      }
      return true;
    }),
  body('theme.gradientEnd')
    .optional()
    .custom((value) => {
      // Accept both hex and rgba colors
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
      if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
        throw new Error('Invalid gradient end color format');
      }
      return true;
    }),
  body('theme.borderRadius').optional().isNumeric().withMessage('borderRadius must be a number'),
  body('theme.elevation').optional().isNumeric().withMessage('elevation must be a number'),
  body('status').optional().isIn(['active', 'archived', 'completed']).withMessage('Invalid status')
];

// Get all notes for a user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ order: 1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a note
router.post('/', [auth, ...createNoteValidation], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, content, theme, status } = req.body;

    // Get highest order number
    const highestOrder = await Note.findOne({ user: req.user._id })
      .sort({ order: -1 })
      .select('order');
    
    const order = (highestOrder?.order || 0) + 1;

    const note = new Note({
      title,
      content,
      theme,
      status,
      order,
      user: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update a note's theme
router.patch('/:id/theme', [auth, ...updateNoteValidation], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { theme } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.theme = { ...note.theme, ...theme };
    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Error updating note theme:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update a note
router.patch('/:id', [auth, ...updateNoteValidation], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, content, theme, status } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (theme) note.theme = { ...note.theme, ...theme };
    if (status) note.status = status;

    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete a note
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update note order
router.patch('/:id/order', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { newOrder } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const oldOrder = note.order;

    // Update orders of notes between old and new positions
    if (newOrder > oldOrder) {
      await Note.updateMany(
        { 
          user: req.user._id,
          order: { $gt: oldOrder, $lte: newOrder }
        },
        { $inc: { order: -1 } }
      );
    } else if (newOrder < oldOrder) {
      await Note.updateMany(
        {
          user: req.user._id,
          order: { $gte: newOrder, $lt: oldOrder }
        },
        { $inc: { order: 1 } }
      );
    }

    note.order = newOrder;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router; 