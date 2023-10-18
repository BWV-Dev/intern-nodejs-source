// @ts-nocheck
/**
 * Login controller
 */
import {Request, Response} from 'express';
import {UserRepository} from '../repositories/user.repository';
import * as logger from '../utils/logger';
import {messages} from '../constants';

/**
 * GET login
 */
export const login = (req: Request, res: Response) => {
  res.render('login/index', {
    layout: 'layout/loginLayout',
    message: '',
    username: '',
  });
};

/**
 * POST login
 */
export const auth = async (req: Request, res: Response) => {
  try {
    // load a post by a given post id
    const user = await UserRepository.verifyCredentials(
      req.body.email,
      req.body.password,
    );

    if (!user) {
      // write log
      logger.logInfo(
        req,
        `Failed login attempt: name(${req.body.email || ''})`,
      );

      return res.status(400).json({
        message: messages.ECL016,
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
      res.status(200).json({
        urlRedirect: decodeURIComponent(req.query.redirect!.toString()),
      });
    } else {
      res.status(200).json('/user/list');
    }
  } catch (err) {
    console.log('error', err);
    // write log
    logger.logInfo(req, `Failed login attempt: name(${req.body.email || ''})`);

    return res.status(400).json({
      message: messages.ECL016,
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

  let redirectURL = '/login';
  if (req.query.redirect !== undefined) {
    redirectURL += `?redirect=${encodeURIComponent(
      req.query.redirect!.toString(),
    )}`;
  }
  res.redirect(redirectURL);
};
