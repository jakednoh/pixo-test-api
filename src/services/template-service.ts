import { TemplateModel, Template } from '@models/TemplateModel';
import repositoryFactory from '../repositories/base-repository';

const templateRepository = repositoryFactory(TemplateModel);

const listTemplates = async (filter: any, limit: number, offset: number) =>
  templateRepository.list(filter, limit, offset);

const getTemplate = async (id: string) => templateRepository.getById(id);

const createTemplate = async (template: Omit<Template, '_id'>) => {
  return await templateRepository.create(template);
};

const deleteTemplate = async (id: string) => {
  return await templateRepository.delete(id);
};

const updateTemplate = async (id: string, template: Template) => {
  return await templateRepository.update(id, template);
};

const service = {
  listTemplates: listTemplates,
  getTemplate: getTemplate,
  createTemplate: createTemplate,
  deleteTemplate: deleteTemplate,
  updateTemplate: updateTemplate,
};

export default service;
