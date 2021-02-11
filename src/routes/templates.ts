import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { asyncWrapper } from '@utils/helper';
import templateService from '../services/template-service';
import { body, validationResult } from 'express-validator';

const router = Router();
const { CREATED, OK, NO_CONTENT, BAD_REQUEST } = StatusCodes;

router.get(
  '/',
  asyncWrapper(async (req: Request, res: Response) => {
    const templates = await templateService.listTemplates();
    return res.status(OK).json(templates);
  })
);

router.post(
  '/',
  body('name', 'Name cannot be empty').not().isEmpty(),
  body('assetUrl', 'assetUrl is not valid').isURL(),
  body('thumbnailUrl', 'thumbnailUrl is not valid').isURL(),
  asyncWrapper(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    const template = req.body;
    const createdTemplate = await templateService.createTemplate(template);
    return res.status(CREATED).json(createdTemplate);
  })
);

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await templateService.deleteTemplate(id);
  return res.status(NO_CONTENT).end();
});

export default router;
