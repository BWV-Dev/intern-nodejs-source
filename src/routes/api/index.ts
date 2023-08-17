/**
 * API Router
 */
import { Router } from 'express';
import userApiRouter from './user';

const apiRouter = Router();

apiRouter.use((_, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// ROUTER API
apiRouter.use('/user', userApiRouter);

export default apiRouter;
