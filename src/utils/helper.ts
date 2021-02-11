import { NextFunction, RequestHandler, Response, Request } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncWrapper = (fn: AsyncRequestHandler): RequestHandler => (req, res, next) =>
  fn(req, res, next).catch(next);
