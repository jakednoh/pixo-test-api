import { Template, TemplateDocument } from '@models/Template';
import repositoryFactory from '../repositories/base-repository';

const templateRepository = repositoryFactory(Template);

export type TemplateService = {
  listTemplates: () => Promise<TemplateDocument[]>;
  createTemplate: (template: Omit<TemplateDocument, '_id'>) => Promise<any>;
  deleteTemplate: (id: string) => Promise<void>;
};

const listTemplates = async () => templateRepository.list();

const createTemplate = async (template: Omit<TemplateDocument, '_id'>) => {
  return await templateRepository.create(template);
};

const deleteTemplate = async (id: string) => {
  await templateRepository.delete(id);
};

const service: TemplateService = {
  listTemplates: listTemplates,
  createTemplate: createTemplate,
  deleteTemplate: deleteTemplate,
};

export default service;
