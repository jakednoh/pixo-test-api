import mongoose, { Schema, Document } from 'mongoose';

export type Category = {
  _id: string;
  name: string;
  visible: boolean;
};

const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
  visible: { type: Boolean, default: false },
});

export const CategoryModel = mongoose.model<Document & Category>('Category', categorySchema);
