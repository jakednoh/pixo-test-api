import { Template, TemplateModel } from '@models/Template';
import repositoryFactory from '../repositories/base-repository';

const templateRepository = repositoryFactory(TemplateModel);

const listTemplates = async (filter: any, limit: number, offset: number) =>
  templateRepository.list(filter, limit, offset);

const getTemplate = async (id: string) => templateRepository.getById(id, { populate: 'category' });

const createTemplate = async (template: Omit<Template, '_id'>) => templateRepository.create(template);

const deleteTemplate = async (id: string) => templateRepository.delete(id);

const updateTemplate = async (id: string, template: Template) => templateRepository.update(id, template);

const service = {
  listTemplates: listTemplates,
  getTemplate: getTemplate,
  createTemplate: createTemplate,
  deleteTemplate: deleteTemplate,
  updateTemplate: updateTemplate,
};

export default service;
