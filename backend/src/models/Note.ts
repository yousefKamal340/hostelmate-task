import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  backgroundColor: { type: String, default: '#ffffff' },
  gradientStart: { type: String },
  gradientEnd: { type: String },
  textColor: { type: String, default: '#000000' },
  useGradient: { type: Boolean, default: false },
  borderRadius: { type: Number, default: 8 },
  elevation: { type: Number, default: 4 },
}, { _id: false });

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
  },
  order: { type: Number, required: true },
  theme: { type: themeSchema, default: () => ({}) },
}, {
  timestamps: true,
});

export const Note = mongoose.model('Note', noteSchema); 