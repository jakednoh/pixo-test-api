import { Document, Model } from 'mongoose';
import logger from '@utils/logger';
import { BadRequestError } from '@utils/errors';

type TDoc<T> = Document & T;

function factory<T>(model: Model<TDoc<T>>) {
  return {
    // TODO: add filter and pagination
    list: async (filter?: any) => (await model.find({})).map(elem => elem.toObject({ versionKey: false })) || [],
    create: async (doc: any) => {
      const saved = await model.create(doc);
      return saved.toObject({ versionKey: false });
    },
    getById: async (id: string) => {
      const result = await model.findById(id);
      return (result as TDoc<T>).toObject({ versionKey: false }) || null;
    },
    update: async (id: string, doc: T) => {
      const saved = await model.findByIdAndUpdate(id, doc);
      if (!saved) {
        throw new BadRequestError(`Could not find any item with identifier: ${id}`);
      }
      return saved.toObject({ versionKey: false });
    },
    delete: async (id: string) => {
      await model.findByIdAndDelete(id);
    },
  };
}

export default factory;
