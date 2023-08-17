/**
 * User Api Router
 */
import * as userController from '../../controllers/auth.controller';
import { Router } from 'express';

const userApiRouter = Router();

userApiRouter.get('/checkUserIsExist', userController.checkUserIsExist);
export default userApiRouter;
