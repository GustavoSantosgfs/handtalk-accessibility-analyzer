import mongoose, { Schema, Document } from 'mongoose';
import { AccessibilityResult } from '../types/analysis';

export interface IAnalysis extends Document {
  url: string;
  result: AccessibilityResult;
  analyzedAt: Date;
  duration: number;
}

const TitleAnalysisSchema = new Schema({
  exists: { type: Boolean, required: true },
  content: { type: String, default: null },
  isEmpty: { type: Boolean, required: true }
}, { _id: false });

const ImageAnalysisSchema = new Schema({
  total: { type: Number, required: true },
  withoutAlt: { type: Number, required: true },
  missingAltImages: [{ type: String }]
}, { _id: false });

const InputAnalysisSchema = new Schema({
  total: { type: Number, required: true },
  withoutLabel: { type: Number, required: true },
  inputsWithoutLabel: [{ type: String }]
}, { _id: false });

const AccessibilityResultSchema = new Schema({
  title: { type: TitleAnalysisSchema, required: true },
  images: { type: ImageAnalysisSchema, required: true },
  inputs: { type: InputAnalysisSchema, required: true },
  score: { type: Number, required: true },
  passedChecks: { type: Number, required: true },
  totalChecks: { type: Number, required: true }
}, { _id: false });

const AnalysisSchema = new Schema({
  url: { type: String, required: true, index: true },
  result: { type: AccessibilityResultSchema, required: true },
  analyzedAt: { type: Date, default: Date.now, index: true },
  duration: { type: Number, required: true }
}, {
  timestamps: true
});

AnalysisSchema.index({ analyzedAt: -1 });

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
