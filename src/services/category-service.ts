import { Category, CategoryModel } from '@models/Category';
import repositoryFactory from '../repositories/base-repository';

const categoryRepository = repositoryFactory(CategoryModel);

const listCategories = async (filter: any, limit: number, offset: number) =>
  categoryRepository.list(filter, limit, offset);

const getCategory = async (id: string) => categoryRepository.getById(id);

const createCategory = async (category: Omit<Category, '_id'>) => categoryRepository.create(category);

const deleteCategory = async (id: string) => categoryRepository.delete(id);

const updateCategory = async (id: string, category: Category) => categoryRepository.update(id, category);

const service = {
  listCategories: listCategories,
  getCategory: getCategory,
  createCategory: createCategory,
  deleteCategory: deleteCategory,
  updateCategory: updateCategory,
};

export default service;
