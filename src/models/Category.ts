import mongoose, { Schema, Document } from 'mongoose';

export type Category = {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  visible: boolean;
};

const categorySchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  visible: { type: Boolean, default: true },
});

export const CategoryModel = mongoose.model<Document & Category>('Category', categorySchema);
