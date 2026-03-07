import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  telegramId: number;
  coinId: string;
  targetPrice: number;
  direction: 'above' | 'below';
  triggered: boolean;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  telegramId: { type: Number, required: true },
  coinId: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  direction: { type: String, enum: ['above', 'below'], required: true },
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Alert = mongoose.model<IAlert>('Alert', AlertSchema);
