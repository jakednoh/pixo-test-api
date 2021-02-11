import mongoose, { Document, Schema } from 'mongoose';

export type Template = {
  _id: string;
  category: string;
  name: string;
  thumbnailUrl: string;
  assetUrl: string;
  visible: boolean;
};

const templateSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  thumbnailUrl: { type: String },
  assetUrl: { type: String },
  visible: { type: Boolean, default: false },
});

export const TemplateModel = mongoose.model<Document & Template>('Template', templateSchema);
