/**
 * Error Controller
 */
import {Request, Response} from 'express';
import {titleMessageError, messages} from '../constants';

export const notFound = (req: Request, res: Response) => {
  if (req.user.id !== undefined) {
    res.render('errors/index', {
      title: titleMessageError.NOT_FOUND,
      content: messages.NOT_FOUND,
    });

    return;
  } else {
    res.redirect('/login');
  }
};
