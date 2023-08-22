/**
 * Login Router
 */
import {Router} from 'express';
import * as authController from '../controllers/auth.controller';
import {nextWrapper} from '../utils/common';
import loginValidator from '../validators/login.validator';
import validators from '../validators/validators';

const authRouter = Router();

authRouter.get('/login', nextWrapper(authController.login));
authRouter.post(
  '/login',
  loginValidator.login(),
  validators,
  nextWrapper(authController.auth),
);
authRouter.get('/logout', nextWrapper(authController.logout));

authRouter.post('/isExistAccount', nextWrapper(authController.isExistAccount));

authRouter.post('/checkSession', nextWrapper(authController.checkSession));

export default authRouter;
