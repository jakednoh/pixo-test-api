import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { asyncWrapper, isValidObjectId } from '@utils/helper';
import categoryService from '../services/category-service';
import { body, validationResult } from 'express-validator';

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
    const results = await categoryService.listCategories(
      filter,
      parseInt(limit.toString()),
      parseInt(offset.toString())
    );
    return res.status(OK).json(results);
  })
);

router.get(
  '/:id',
  asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.getCategory(id);
    return res.status(OK).json(result);
  })
);

router.post(
  '/',
  body('name', 'Name cannot be empty').not().isEmpty(),
  asyncWrapper(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    const category = req.body;
    if (category._id && !isValidObjectId(category._id)) {
      delete category._id;
    }
    const result = await categoryService.createCategory(category);
    return res.status(CREATED).json(result);
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
    const category = req.body;
    delete category._id;
    const { id } = req.params;
    const result = await categoryService.updateCategory(id, category);
    return res.status(OK).json(result);
  })
);

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);
  return res.status(NO_CONTENT).end();
});

export default router;
