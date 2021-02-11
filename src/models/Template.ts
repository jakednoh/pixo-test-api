import mongoose from 'mongoose';

export type TemplateDocument = {
  _id: string;
  category: string;
  name: string;
  thumbnailUrl: string;
  assetUrl: string;
  visible: boolean;
};

const templateSchema = new mongoose.Schema<mongoose.Document & TemplateDocument>({
  category: { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  name: { type: String },
  thumbnailUrl: { type: String },
  assetUrl: { type: String },
  visible: { type: Boolean, default: false },
});

export const Template = mongoose.model<mongoose.Document & TemplateDocument>('Template', templateSchema);
