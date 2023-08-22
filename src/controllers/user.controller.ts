import {Request, Response} from 'express';
import {getCustomRepository} from 'typeorm';
import {UserRepository} from '../repositories/user.repository';
import {numberOfPages} from '../middlewares/viewHelper';
import _ from 'lodash';
import {stringify} from 'csv-stringify/sync';
import moment from 'moment';
import {GroupRepository} from '../repositories/group.repository';
import {User} from '../entities/user.entity';
import bcrypt from 'bcrypt';
import {messages, position} from '../constants';

/**
 * GET list
 */
export const list = async (req: Request, res: Response) => {
  try {
    // Check validate on server
    const errorMessages = (req.session as any)?.message;
    delete (req.session as any).message;

    const eventMessage = (req.session as any).eventMessage;
    delete (req.session as any).eventMessage;

    let isDefault = false;

    if (_.isEmpty(req.query)) {
      isDefault = true;
    }
    const username = req.query.username;
    const startedDateFrom = req.query.startedDateFrom;
    const startedDateTo = req.query.startedDateTo;

    const searchConditions = {
      username,
      startedDateFrom,
      startedDateTo,
    };

    if (errorMessages) {
      res.render('user/list', {
        searchConditions,
        users: undefined,
        numOfPages: undefined,
        page: undefined,
        message: '',
        numOfResults: undefined,
        pages: undefined,
        isDefault: true,
        errorMessages,
        eventMessage,
      });
    }

    const page = Number(req.query.page) || 1;

    const resultsPerPage = Number(process.env.LIMIT) || 10;
    const offset = (page - 1) * resultsPerPage;

    const userRepository = getCustomRepository(UserRepository);

    // Check user login
    const userLogin = await userRepository.findById(req.user.id!);
    (req.session as any).user = userLogin;
    res.locals.loginUser = userLogin;

    const users = await userRepository.search({
      username: username as string,
      startedDateFrom: startedDateFrom as string,
      startedDateTo: startedDateTo as string,
      offset: offset,
      limit: resultsPerPage,
    });

    let message = '';

    const numOfResults = users?.count || 0;
    const numOfPages = Math.ceil(numOfResults / resultsPerPage);

    message = numOfResults > 0 ? '' : 'No User Found';

    const pages = numberOfPages(numOfResults, page);

    res.render('user/list', {
      searchConditions,
      users: users.data,
      numOfPages: numOfPages,
      page: page,
      message: message,
      numOfResults: numOfResults,
      pages: pages,
      isDefault,
      errorMessages: '',
      eventMessage,
    });
  } catch (error) {
    res.render('user/list', {
      searchConditions: {
        username: undefined,
        startedDateFrom: undefined,
        startedDateTo: undefined,
      },
      users: [],
      numOfPages: 0,
      page: 0,
      message: 'No User Found',
      numOfResults: 0,
      pages: null,
      isDefault: false,
      errorMessages: '',
      eventMessage: '',
    });
  }
};

/**
 * GET addEditDelete
 */
export const addEditDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // check login user
    const userRepository = getCustomRepository(UserRepository);
    const userLogin = await userRepository.findById(req.user.id!);
    (req.session as any).user = userLogin;
    res.locals.loginUser = userLogin;

    if (id) {
      if (userLogin?.positionId != 0 && Number(id) != userLogin?.id) {
        res.redirect('/logout');
      }
    } else {
      if (userLogin?.positionId != 0) {
        (req.session as any).eventMessage = messages.EBT098;
        return res.redirect('/user');
      }
    }

    let isSelf = false;
    if (userLogin?.positionId != 0 && Number(id) == userLogin?.id) {
      isSelf = true;
    }

    let query = {
      username: req.query.username,
      email: req.query.email,
      groupId: req.query.groupId,
      positionId: req.query.positionId,
      startedDate: req.query.startedDate,
      password: req.query.password,
      passConfirm: req.query.passConfirm,
    };

    if (id) {
      const foundUser = await userRepository.findById(id);

      if (foundUser) {
        query = {
          username: foundUser?.name,
          email: foundUser?.email,
          groupId: foundUser?.groupId.toString(),
          positionId: foundUser?.positionId.toString(),
          startedDate: moment(foundUser?.startedDate.toString(), 'YYYY-MM-DD')
            .add(1, 'day')
            .format('DD/MM/YYYY'),
          password: undefined,
          passConfirm: undefined,
        };
      } else {
        (req.session as any).eventMessage = messages.EBT098;
        res.redirect('/user');
      }
    }

    const groupRepository = getCustomRepository(GroupRepository);
    const listGroupName = await groupRepository.findListGroupName();

    res.render('user/addEditDelete', {
      id: id,
      query,
      position,
      listGroupName,
      isSelf,
      errorMessages: '',
    });
  } catch (error) {
    res.render('user/addEditDelete', {
      id: req.params.id,
      query: {
        username: undefined,
        email: undefined,
        groupId: undefined,
        positionId: undefined,
        startedDate: undefined,
        password: undefined,
        passConfirm: undefined,
      },
      position,
      listGroupName: [],
      isSelf: false,
      errorMessages: '',
    });
  }
};

/**
 * POST editDelete
 */
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const errorMessages = (req.session as any).message;
    delete (req.session as any).message;

    // check login user
    const userRepository = getCustomRepository(UserRepository);
    const userLogin = await userRepository.findById(req.user.id!);
    (req.session as any).user = userLogin;
    res.locals.loginUser = userLogin;

    if (userLogin?.positionId != 0 && Number(id) != userLogin?.id) {
      return res.redirect('/logout');
    }

    let isSelf = false;
    if (userLogin?.positionId != 0 && Number(id) == userLogin?.id) {
      isSelf = true;
    }

    const query = {
      username: req.body.username,
      email: req.body.email,
      groupId: req.body.groupId,
      positionId: req.body.positionId,
      startedDate: req.body.startedDate,
      password: req.body.password,
      passConfirm: req.body.passConfirm,
    };

    const groupRepository = getCustomRepository(GroupRepository);
    const listGroupName = await groupRepository.findListGroupName();

    if (errorMessages) {
      return res.render('user/addEditDelete', {
        id: id,
        query,
        position,
        listGroupName,
        errorMessages,
        isSelf,
      });
    }

    query.startedDate = moment(query.startedDate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );

    const user = new User();
    user.id = Number(id);
    user.name = query.username;
    user.email = query.email;
    user.startedDate = new Date(query.startedDate);
    user.groupId = query.groupId;
    user.positionId = query.positionId;
    user.updatedDate = new Date();

    // hash password
    if (!_.isEmpty(query.password)) {
      const saltRounds = Number(process.env.SALTROUNDS) || 10;
      const hash = bcrypt.hashSync(query.password, saltRounds);
      user.password = hash;
    }

    await userRepository.edit(user);

    (req.session as any).eventMessage = messages.EBT096;

    res.redirect('/user');
  } catch (error) {
    (req.session as any).eventMessage = messages.EBT095;
    res.redirect('/user');
  }
};

/**
 * POST add
 */
export const add = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const errorMessages = (req.session as any).message;
    delete (req.session as any).message;

    const query = {
      username: req.body.username,
      email: req.body.email,
      groupId: req.body.groupId,
      positionId: req.body.positionId,
      startedDate: req.body.startedDate,
      password: req.body.password,
      passConfirm: req.body.passConfirm,
    };

    const groupRepository = getCustomRepository(GroupRepository);
    const listGroupName = await groupRepository.findListGroupName();

    if (errorMessages) {
      return res.render('user/addEditDelete', {
        id: id,
        query,
        position,
        listGroupName,
        errorMessages,
        isSelf: false,
      });
    }

    // hash password
    const saltRounds = Number(process.env.SALTROUNDS) || 10;
    const hash = bcrypt.hashSync(query.password, saltRounds);

    query.startedDate = moment(query.startedDate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );

    const user = new User();
    user.name = query.username;
    user.email = query.email;
    user.startedDate = new Date(query.startedDate);
    user.groupId = query.groupId;
    user.positionId = query.positionId;
    user.password = hash;
    user.createdDate = new Date();
    user.updatedDate = new Date();

    const userRepository = getCustomRepository(UserRepository);

    await userRepository.add(user);

    (req.session as any).eventMessage = messages.EBT096;

    res.redirect('/user');
  } catch (error) {
    (req.session as any).eventMessage = messages.EBT095;
    res.redirect('/user');
  }
};

/**
 * POST delete
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // check login user
    const userRepository = getCustomRepository(UserRepository);
    const userLogin = await userRepository.findById(req.user.id!);
    (req.session as any).user = userLogin;
    res.locals.loginUser = userLogin;

    if (userLogin?.positionId != 0 && Number(id) != userLogin?.id) {
      return res.redirect('/logout');
    }

    if (Number(id) != userLogin?.id) {
      await userRepository.deleteUser(id);
      (req.session as any).eventMessage = messages.EBT096;
      res.json(messages.EBT095);
    } else {
      res.json(messages.EBT086);
    }
    res.end();
  } catch (error) {
    (req.session as any).eventMessage = messages.EBT095;
    res.json(messages.EBT096);
    res.end();
  }
};

/**
 * GET exportCSV
 */
export const exportCSV = async (req: Request, res: Response) => {
  const username = req.query.username;
  const startedDateFrom = req.query.startedDateFrom;
  const startedDateTo = req.query.startedDateTo;

  const userRepository = getCustomRepository(UserRepository);

  const users = await userRepository.search(
    {
      username: username as string,
      startedDateFrom: startedDateFrom as string,
      startedDateTo: startedDateTo as string,
    },
    true,
  );

  const datas: any = [];

  _.forEach(users.data, function(user) {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      groupId: user.groupId,
      groupName: user.group ? user.group.name : ``,
      startedDate: moment(user.startedDate)
        .add(1, 'day')
        .format('DD/MM/YYYY'),
      position:
        user.positionId == 0
          ? 'Director'
          : user.positionId == 1
          ? 'Group Leader'
          : user.positionId == 2
          ? 'Leader'
          : user.positionId == 3
          ? 'Member'
          : '',
      createdDate: moment(user.createdDate)
        .add(1, 'day')
        .format('DD/MM/YYYY'),
      updatedDate: moment(user.updatedDate)
        .add(1, 'day')
        .format('DD/MM/YYYY'),
    };

    datas.push(data);
  });

  const columns = [
    {key: 'id', header: 'ID'},
    {key: 'name', header: 'User Name'},
    {key: 'email', header: 'Email'},
    {key: 'groupId', header: 'Group ID'},
    {key: 'groupName', header: 'Group Name'},
    {key: 'startedDate', header: 'Started Date'},
    {key: 'position', header: 'Position'},
    {key: 'createdDate', header: 'Created Date'},
    {key: 'updatedDate', header: 'Updated Date'},
  ];

  let str = stringify(datas!, {
    columns: columns,
    quoted_empty: true,
    quoted_string: true,
  });

  str =
    'ID,User Name,Email,Group ID,Group Name,Started Date,Position,Created Date,Updated Date\n' +
    str;

  res.json(str);
};
