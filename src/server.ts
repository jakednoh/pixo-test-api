import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import 'express-async-errors';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';

import BaseRouter from './routes';

import connectDb from '@utils/connect-db';
import logger from '@utils/logger';
import { Errors } from '@utils/errors';

const app = express();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
connectDb(mongoUrl);

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const status = err.name === Errors.BadRequestError ? BAD_REQUEST : INTERNAL_SERVER_ERROR;
  return res.status(status).json({
    error: err.message,
  });
});

// Export express instance
export default app;
