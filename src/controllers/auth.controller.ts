// @ts-nocheck
/**
 * Login controller
 */
import * as logger from '../utils/logger';
import {Request, Response} from 'express';
import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';
import {messages} from '../constants';

/**
 * GET login
 */
export const login = (req: Request, res: Response) => {
  res.render('login/index', {
    layout: 'layout/loginLayout',
    message: '',
    email: '',
  });
};

/**
 * POST login
 */
export const auth = async (req: Request, res: Response) => {
  try {
    // check validate on server
    const errorMessages = req.session.message;
    delete req.session.message;

    if (errorMessages) {
      res.render('login/index', {
        layout: 'layout/loginLayout',
        email: req.body.email,
        message: errorMessages,
      });
    }
    // get a User repository to perform operations with User
    const userRepository = getCustomRepository(UserRepository);

    // load a post by a given post id
    const user = await userRepository.verifyCredentials(
      req.body.email,
      req.body.password,
    );

    if (!user) {
      // write log
      logger.logInfo(
        req,
        `Failed login attempt: name(${req.body.email || ''})`,
      );

      return res.render('login/index', {
        layout: 'layout/loginLayout',
        email: req.body.email,
        message: messages.EBT016,
      });
    }

    // save user info into session
    (req.session as Express.Session).user = {
      ...user,
    };

    // write log
    logger.logInfo(req, `User id(${user!.id}) logged in successfully.`);

    // If [ログイン] clicked, then redirect to TOP page
    if (
      req.query.redirect !== undefined &&
      req.query.redirect.length! > 0 &&
      req.query.redirect !== '/'
    ) {
      res.redirect(decodeURIComponent(req.query.redirect!.toString()));
    } else {
      res.redirect('/user');
    }
  } catch (err) {
    // write log
    logger.logInfo(req, `Failed login attempt: name(${req.body.email || ''})`);

    res.render('login/index', {
      layout: 'layout/loginLayout',
      email: req.body.email,
      message: 'Test',
    });
  }
};

/**
 * GET logout
 */
export const logout = async (req: Request, res: Response) => {
  req.user.destroy();

  // write log
  logger.logInfo(req, 'User logged out successfully.');

  const redirectURL = '/login';

  res.redirect(redirectURL);
};

/**
 * POST check account is existed
 */
export const isExistAccount = async (req: Request, res: Response) => {
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.findByEmail(req.body.email);

  if (req.body.id) {
    return user && req.body.id != user.id
      ? res.json('Found')
      : res.json('Not Found');
  } else {
    return user ? res.json('Found') : res.json('Not Found');
  }
};

/**
 * POST check session
 */
export const checkSession = async (req: Request, res: Response) => {
  return req.user.id ? res.json('noLogout') : res.json('logout');
};
