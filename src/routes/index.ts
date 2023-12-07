/**
 * Main Router
 */
import {Router} from 'express';
import {notFound as notFoundHandler} from '../controllers/error.controller';
import auth from '../middlewares/authentication';
import sessionMiddleWare from '../middlewares/session';
import userMiddleware from '../middlewares/user';
import authRouter from './auth';
import viewHelper from '../middlewares/viewHelper';

const router = Router();

router.use(sessionMiddleWare);
router.use(userMiddleware);
router.use('/', authRouter);
router.use(auth);
router.use(viewHelper);

router.get('/', (req, res) => {
  res.render('index');
});

// 404 error
router.use(notFoundHandler);

export default router;
