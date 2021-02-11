import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { asyncWrapper } from '@utils/helper';
import categoryService from '../services/category-service';

const router = Router();

const { CREATED, OK } = StatusCodes;

router.get(
  '/',
  asyncWrapper(async (req: Request, res: Response) => {
    return res.status(OK).json([]);
  })
);

export default router;
