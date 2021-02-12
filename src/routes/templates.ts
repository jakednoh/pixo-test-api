import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { asyncWrapper, isValidObjectId } from '@utils/helper';
import templateService from '../services/template-service';
import { body, validationResult } from 'express-validator';
import { BadRequestError, InternalServerError } from '@utils/errors';
import fetch from 'node-fetch';

const router = Router();
const { CREATED, OK, NO_CONTENT, BAD_REQUEST } = StatusCodes;

router.get(
  '/',
  asyncWrapper(async (req: Request, res: Response) => {
    const { name, limit = 100, offset = 0 } = req.query;
    const filter: any = {};
    if (name) {
      filter.name = name;
      filter.visible = true;
    }
    const templates = await templateService.listTemplates(
      filter,
      parseInt(limit.toString()),
      parseInt(offset.toString())
    );
    return res.status(OK).json(templates);
  })
);

router.get(
  '/:id',
  asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await templateService.getTemplate(id);
    return res.status(OK).json(result);
  })
);

router.post(
  '/',
  body('name', 'Name cannot be empty').not().isEmpty(),
  body('assetUrl', 'assetUrl is not valid').optional().isURL(),
  body('thumbnailUrl', 'thumbnailUrl is not valid').optional().isURL(),
  asyncWrapper(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    const template = req.body;
    if (template._id && !isValidObjectId(template._id)) {
      delete template._id;
    }
    const createdTemplate = await templateService.createTemplate(template);
    return res.status(CREATED).json(createdTemplate);
  })
);

router.put(
  '/:id',
  body('name', 'Name cannot be empty').optional().not().isEmpty(),
  body('assetUrl', 'assetUrl is not valid').optional().isURL(),
  body('thumbnailUrl', 'thumbnailUrl is not valid').optional().isURL(),
  asyncWrapper(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    const template = req.body;
    delete template._id;
    const { id } = req.params;
    const updatedTemplate = await templateService.updateTemplate(id, template);
    return res.status(OK).json(updatedTemplate);
  })
);

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await templateService.deleteTemplate(id);
  return res.status(NO_CONTENT).end();
});

router.get('/:id/thumbnail', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await templateService.getTemplate(id);
  if (!result?.thumbnailUrl) {
    throw new BadRequestError(`thumbnailUrl does not exist in the template: ${id}`);
  }
  const response = await fetch(result.thumbnailUrl);
  if (response.status !== 200) {
    throw new InternalServerError('Thumbnail is not downloadable');
  }
  response.body.pipe(res);
});

router.get('/:id/asset', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await templateService.getTemplate(id);
  if (!result?.assetUrl) {
    throw new BadRequestError(`assetUrl does not exist in the template: ${id}`);
  }
  const response = await fetch(result.assetUrl);
  if (response.status !== 200) {
    throw new InternalServerError('Asset is not downloadable');
  }
  response.body.pipe(res);
});

export default router;
