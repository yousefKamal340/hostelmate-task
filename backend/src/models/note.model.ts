import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId;
  theme: {
    backgroundColor: string;
    textColor: string;
    useGradient?: boolean;
    gradientStart?: string;
    gradientEnd?: string;
    borderRadius?: number;
    elevation?: number;
  };
  status: 'active' | 'archived' | 'completed';
  order: number;
}

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  theme: {
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    useGradient: {
      type: Boolean,
      default: false
    },
    gradientStart: {
      type: String
    },
    gradientEnd: {
      type: String
    },
    borderRadius: {
      type: Number,
      default: 8
    },
    elevation: {
      type: Number,
      default: 4
    }
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and order
noteSchema.index({ user: 1, order: 1 });

export const Note = model<INote>('Note', noteSchema); 