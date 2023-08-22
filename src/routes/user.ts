import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {nextWrapper} from '../utils/common';
import userValidator from '../validators/user.validator';
import validators from '../validators/validators';
import {permission} from '../middlewares/screenPermission';

const userRouter = Router();

userRouter.get(
  '/',
  userValidator.list(),
  validators,
  nextWrapper(userController.list),
);
userRouter.get('/:id(\\d+)', nextWrapper(userController.addEditDelete));
userRouter.post(
  '/:id(\\d+)',
  userValidator.edit(),
  validators,
  nextWrapper(userController.edit),
);
userRouter.get(
  '/add',
  permission([0]),
  nextWrapper(userController.addEditDelete),
);
userRouter.post(
  '/add',
  permission([0]),
  userValidator.add(),
  validators,
  nextWrapper(userController.add),
);
userRouter.post('/delete/:id(\\d+)', nextWrapper(userController.remove));
userRouter.get('/export', nextWrapper(userController.exportCSV));

export default userRouter;
