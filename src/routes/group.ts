import {Router} from 'express';
import * as groupController from '../controllers/group.controller';
import {nextWrapper} from '../utils/common';
import multer from 'multer';
import {permission} from '../middlewares/screenPermission';
const groupRouter = Router();

const upload = multer({dest: 'public/csv/'});

groupRouter.get('/', permission([0]), nextWrapper(groupController.list));
groupRouter.post(
  '/import',
  upload.single('file'),
  nextWrapper(groupController.importCSV),
);

export default groupRouter;
