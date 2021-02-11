import { Document, Model } from 'mongoose';
import { BadRequestError } from '@utils/errors';

type TDoc<T> = Document & T;

export type BaseRepository<T> = {
  list: (filter: any, limit: number, offset: number) => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (doc: Omit<T, '_id'>) => Promise<T>;
  update: (id: string, doc: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
};

const docToObject = <D extends Document<any>>(doc: D) =>
  doc.toObject({ versionKey: false }) as D extends Document<infer Model> ? Model & { _id: string } : never;

function factory<T>(model: Model<TDoc<T>>): BaseRepository<T> {
  return {
    list: async (filter, limit = 100, offset = 0) =>
      (await model.find(filter).limit(limit).skip(offset)).map(elem => docToObject(elem)) || [],
    create: async doc => {
      const saved = await model.create(doc);
      return docToObject(saved);
    },
    getById: async id => {
      const result = await model.findById(id);
      return result ? docToObject(result) : null;
    },
    update: async (id: string, doc: T) => {
      const result = await model.findByIdAndUpdate(id, doc, { new: true });
      if (!result) {
        throw new BadRequestError(`Could not find any item with identifier: ${id}`);
      }
      return docToObject(result);
    },
    delete: async (id: string) => {
      const result = await model.findByIdAndDelete(id);
      if (!result) {
        throw new BadRequestError(`Could not find any item with identifier: ${id}`);
      }
    },
  };
}

export default factory;
