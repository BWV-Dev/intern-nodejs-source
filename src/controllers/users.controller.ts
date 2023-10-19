/**
 * GET User List
 */

import { Request, Response } from 'express';
// @ts-ignore

import moment from 'moment';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/bcrypt';
import {
  checkValidateAddUser
} from '../utils/checkValidateUser';
import { Status } from '../constants';

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

/**
 * User add
 */
export const add = async (req: Request, res: Response) => {
  res.render('users/addEditDeleteUser', {
    user: {},
    error: '',
    successMsg: '',
    activeTab: 2,
  });
};

/**
 * User add
 */
export const handleAdd = async (req: Request, res: Response) => {
  let checkValidateUser: string[] | null = [];
  const errorList: string[] | null = [];
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  const {
    name,
    email,
    role,
    password,
    passwordConfirmation,
  } = req.body;

  try {
    checkValidateUser = checkValidateAddUser(
      name,
      email,
      role,
      password,
      passwordConfirmation,
    );

    if (checkValidateUser !== null) {
      throw new Error();
    }
  } catch (err) {
    return res
      .status(400)
      .json({error: 'ValidateFailed', message: checkValidateUser});
  }

  try {
    const user = Object.assign(new User(), {
      name,
      email,
      role,
      password: await hashPassword(password),
      deleted: Status.NO,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    const doubleData = await UserRepository.find({
      where: {email: user.email},
    });

    doubleData.forEach(data => {
      if (data.email === user.email) {
        errorList.push(`すでにメールアドレスは登録されています。`);
      }
    });

    if (errorList.length > 0) {
      throw new Error();
    } else {
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return res.status(200).json('success');
    }
  } catch (err) {
    await queryRunner.rollbackTransaction();

    return res.status(400).json({error: 'Duplicate', message: errorList});
  } finally {
    await queryRunner.release();
  }
};