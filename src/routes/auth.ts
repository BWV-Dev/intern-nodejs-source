/**
 * Login Router
 */
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation';
import * as models from '../models';

const authRouter = Router();

authRouter.get('/login', authController.login);
authRouter.post('/login', authController.auth);
authRouter.get('/logout', authController.logout);
authRouter.post(
  '/register',
  validationMiddleware(models.UserCreateDTO),
  authController.register,
);

export default authRouter;
