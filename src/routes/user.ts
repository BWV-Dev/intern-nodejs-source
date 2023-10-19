import {Router} from 'express';

import * as userController from '../controllers/users.controller';

const userRouter = Router();

/**
 * GET User List
 */
userRouter.get('/list', userController.getUserList);

/**
 * SEARCH User
 */

userRouter.get('/search', userController.searchUsers);

/**
 * ADD New User
 */
userRouter.get('/add', userController.add);
userRouter.post('/add', userController.handleAdd);

export default userRouter;
