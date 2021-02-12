import mongoose, { Document, Schema } from 'mongoose';

export type Template = {
  _id: string | mongoose.Types.ObjectId;
  category?: string | mongoose.Types.ObjectId | null;
  name: string;
  thumbnailUrl?: string;
  assetUrl?: string;
  visible: boolean;
};

const templateSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  thumbnailUrl: { type: String },
  assetUrl: { type: String },
  visible: { type: Boolean, default: true },
});

export const TemplateModel = mongoose.model<Document & Template>('Template', templateSchema);
