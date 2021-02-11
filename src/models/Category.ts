import mongoose from 'mongoose';

export type CategoryDocument = {
  _id: string;
  category: string;
  name: string;
  thumbnailUrl: string;
  assetUrl: string;
  visible: boolean;
};

const categorySchema = new mongoose.Schema<mongoose.Document & CategoryDocument>({
  category: { type: mongoose.Types.ObjectId, ref: 'Category' },
  name: { type: String },
  thumbnailUrl: { type: String },
  assetUrl: { type: String },
  visible: { type: Boolean, default: false },
});

export const Category = mongoose.model<mongoose.Document & CategoryDocument>('Category', categorySchema);
