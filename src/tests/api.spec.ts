import request from 'supertest';
import app from '@server';
import StatusCodes from 'http-status-codes';
import { Template, TemplateModel } from '@models/Template';
import { Category, CategoryModel } from '@models/Category';
import mongoose from 'mongoose';
const { CREATED, OK, NO_CONTENT, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

const categories: Category[] = [
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'category-that-is-visible',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'category-that-is-not-visible',
    visible: false,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'category-that-is-also-visible',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'same-name',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'same-name',
    visible: false,
  },
];

const templates: Template[] = [
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-visible',
    category: categories[0]._id,
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-not-visible',
    visible: false,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-visible-and-has-valid-thumbnail',
    thumbnailUrl: 'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-visible-and-has-valid-asset',
    category: categories[0]._id,
    assetUrl: 'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-visible-and-has-invalid-thumbnail',
    category: categories[0]._id,
    thumbnailUrl: 'http://this-is-not-valid.co/image.png',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'template-that-is-visible-and-has-invalid-asset',
    category: categories[0]._id,
    assetUrl: 'http://this-is-not-valid.co/image.png',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'same-name',
    visible: true,
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'same-name',
    visible: false,
  },
];

beforeAll(async () => {
  await Promise.all(categories.map(elem => CategoryModel.create(elem)));
  await Promise.all(templates.map(elem => TemplateModel.create(elem)));
});

afterAll(async () => {
  await CategoryModel.deleteMany();
  await TemplateModel.deleteMany();
});

describe('GET /random-url', () => {
  it('should return 404', done => {
    request(app).get('/random-url').expect(404, done);
  });
});

describe('Template', () => {
  describe('GET /templates', () => {
    it('should return templates', async () => {
      const result = await request(app).get('/api/templates');
      expect(result.status).toEqual(OK);
      expect(result.body).toHaveLength(8);
    });

    it('should return templates with filter', async () => {
      const result = await request(app).get(`/api/templates?name=${templates[6].name}`);

      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject([templates[6]]);
    });
  });

  describe('GET /templates/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).get(`/api/templates/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should return template with category', async () => {
      const result = await request(app).get(`/api/templates/${templates[0]._id.toString()}`);
      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject(Object.assign({}, templates[0], { category: categories[0] }));
    });

    it('should return template without category', async () => {
      const result = await request(app).get(`/api/templates/${templates[2]._id.toString()}`);
      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject(Object.assign({}, templates[2]));
    });
  });

  describe('POST /templates', () => {
    it('should return 400 when no body passed', async () => {
      const result = await request(app).post(`/api/templates`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template without name', async () => {
      const newTemplate = {
        _id: new mongoose.Types.ObjectId().toHexString(),
      };
      const result = await request(app).post(`/api/templates`).send(newTemplate);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template with empty name', async () => {
      const newTemplate = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: '',
      };
      const result = await request(app).post(`/api/templates`).send(newTemplate);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template with invalid thumbnailUrl', async () => {
      const newTemplate = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'new-template',
        assetUrl: 'foo.com',
        thumbnailUrl: 'invalid-url-here',
      };
      const result = await request(app).post(`/api/templates`).send(newTemplate);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template with invalid assetUrl', async () => {
      const newTemplate = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'new-template',
        assetUrl: 'invalid-url-here',
        thumbnailUrl: 'bar.com',
      };
      const result = await request(app).post(`/api/templates`).send(newTemplate);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to create template', async () => {
      const newTemplate = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'new-template',
        assetUrl: 'foo.com',
        thumbnailUrl: 'bar.com',
      };
      const result = await request(app).post(`/api/templates`).send(newTemplate);
      expect(result.status).toEqual(CREATED);
      expect(result.body).toMatchObject(Object.assign({}, newTemplate, { visible: true }));
    });
  });

  describe('PUT /templates/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).put(`/api/templates/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to update template with invalid name', async () => {
      const updateFields = { name: '' };
      const result = await request(app).put(`/api/templates/${templates[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to update template with invalid thumbnailUrl', async () => {
      const updateFields = { thumbnailUrl: 'invalid-url' };
      const result = await request(app).put(`/api/templates/${templates[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to update template with invalid assetUrl', async () => {
      const updateFields = { thumbnailUrl: 'invalid-url' };
      const result = await request(app).put(`/api/templates/${templates[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to update template', async () => {
      const updateFields = { name: 'have-a-beautiful-day' };
      const result = await request(app).put(`/api/templates/${templates[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject(Object.assign({}, templates[0], updateFields));
    });
  });

  describe('DELETE /templates/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).delete(`/api/templates/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to delete template', async () => {
      const result0 = await request(app).get(`/api/templates/${templates[0]._id.toString()}`);
      expect(result0.status).toEqual(OK);
      const result = await request(app).delete(`/api/templates/${templates[0]._id.toString()}`);
      expect(result.status).toEqual(NO_CONTENT);
      const result2 = await request(app).get(`/api/templates/${templates[0]._id.toString()}`);
      expect(result2.status).toEqual(BAD_REQUEST);
    });
  });

  describe('GET /templates/:id/thumbnail', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).get(`/api/templates/${id}/thumbnail`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should return 400 when no thumbnail exists', async () => {
      const result = await request(app).get(`/api/templates/${templates[0]._id}/thumbnail`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should return 400 when thumbnail is invalid', async () => {
      const result = await request(app).get(`/api/templates/${templates[4]._id}/thumbnail`);
      expect(result.status).toEqual(INTERNAL_SERVER_ERROR);
    });

    it('should be able to download thumbnail', async () => {
      const result = await request(app).get(`/api/templates/${templates[2]._id}/thumbnail`);
      expect(result.status).toEqual(OK);
    });
  });

  describe('GET /templates/:id/asset', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).get(`/api/templates/${id}/asset`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should return 400 when no asset exists', async () => {
      const result = await request(app).get(`/api/templates/${templates[0]._id}/asset`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should return 400 when asset is invalid', async () => {
      const result = await request(app).get(`/api/templates/${templates[5]._id}/asset`);
      expect(result.status).toEqual(INTERNAL_SERVER_ERROR);
    });

    it('should be able to download asset', async () => {
      const result = await request(app).get(`/api/templates/${templates[3]._id}/asset`);
      expect(result.status).toEqual(OK);
    });
  });
});

describe('Category', () => {
  describe('GET /categories', () => {
    it('should return categories', async () => {
      const result = await request(app).get('/api/categories');
      expect(result.status).toEqual(OK);
      expect(result.body).toHaveLength(5);
    });

    it('should return templates with filter', async () => {
      const result = await request(app).get(`/api/categories?name=${categories[3].name}`);

      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject([categories[3]]);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).get(`/api/categories/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to get category', async () => {
      const result = await request(app).get(`/api/categories/${categories[0]._id.toString()}`);
      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject(categories[0]);
    });
  });

  describe('POST /categories', () => {
    it('should return 400 when no body passed', async () => {
      const result = await request(app).post(`/api/categories`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template without name', async () => {
      const newCategory = {
        _id: new mongoose.Types.ObjectId().toHexString(),
      };
      const result = await request(app).post(`/api/categories`).send(newCategory);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to create template with empty name', async () => {
      const newCategory = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: '',
      };
      const result = await request(app).post(`/api/categories`).send(newCategory);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to create category', async () => {
      const newCategory = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'new-category',
      };
      const result = await request(app).post(`/api/categories`).send(newCategory);
      expect(result.status).toEqual(CREATED);
      expect(result.body).toMatchObject(Object.assign({}, newCategory, { visible: true }));
    });
  });

  describe('PUT /categories/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).put(`/api/categories/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should not be able to update category with invalid name', async () => {
      const updateFields = { name: '' };
      const result = await request(app).put(`/api/categories/${categories[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to update category', async () => {
      const updateFields = { name: 'have-a-beautiful-day' };
      const result = await request(app).put(`/api/categories/${categories[0]._id.toString()}`).send(updateFields);
      expect(result.status).toEqual(OK);
      expect(result.body).toMatchObject(Object.assign({}, categories[0], updateFields));
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should return 400 when no template found', async () => {
      const id = '6024be63dbf4e54828a67747';
      const result = await request(app).delete(`/api/categories/${id}`);
      expect(result.status).toEqual(BAD_REQUEST);
    });

    it('should be able to delete template', async () => {
      const result0 = await request(app).get(`/api/categories/${categories[0]._id.toString()}`);
      expect(result0.status).toEqual(OK);
      const result = await request(app).delete(`/api/categories/${categories[0]._id.toString()}`);
      expect(result.status).toEqual(NO_CONTENT);
      const result2 = await request(app).get(`/api/categories/${categories[0]._id.toString()}`);
      expect(result2.status).toEqual(BAD_REQUEST);
    });
  });
});
