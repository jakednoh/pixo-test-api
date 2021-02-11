import { Router } from 'express';

import templateRouter from './templates';
import categoryRouter from './categories';

const router = Router();

router.use('/categories', categoryRouter);
router.use('/templates', templateRouter);

export default router;
