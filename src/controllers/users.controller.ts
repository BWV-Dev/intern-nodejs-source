/**
 * GET User List
 */

import {Request, Response} from 'express';

import {UserRepository} from '../repositories/user.repository';

export const getUserList = (req: Request, res: Response) => {
  const updateMsg: string[] = [];
  const insertMsg: string[] = [];

  res.render('users/userList', {
    error: '',
    insertMsg,
    updateMsg,
    params: '',
    activeTab: 0,
  });
};

/**
 * SEARCH Users
 */

export const searchUsers = async (req: Request, res: Response) => {
  const start: any = req.query.start;
  const length: any = req.query.length;
  const draw: any = req.query.draw;
  const name: any = req.query.name;
  const position: any = req.query.position;
  const enteredDateFrom: any = req.query.enteredDateFrom;
  const enteredDateTo: any = req.query.enteredDateTo;

  const {recordsFiltered, userList} = await UserRepository.searchUsers(
    name,
    position,
    enteredDateFrom,
    enteredDateTo,
    length,
    start,
  );

  const data = {
    draw: parseInt(draw),
    recordsTotal: recordsFiltered,
    recordsFiltered: recordsFiltered,
    data: userList,
  };

  res.status(200).json(data);
};
