import {check} from 'express-validator';
import * as _ from 'lodash';
import {messages} from '../constants';
import moment from 'moment';
import {UserRepository} from '../repositories/user.repository';
import {getCustomRepository} from 'typeorm';

function compareDate(dfrom: string, dTo: string) {
  const dateTo = moment(dTo, 'DD/MM/YYYY');
  const dateFrom = moment(dfrom, 'DD/MM/YYYY');

  return moment(dateFrom).isSameOrBefore(dateTo, 'day');
}

const userValidator = {
  list() {
    return [
      check('username')
        .optional()
        .if(value => !_.isNil(value) && value != '')
        .isLength({max: 100})
        .withMessage(username => {
          return messages.EBT002('User Name', 100, username.length);
        }),
      check('startedDateFrom', messages.EBT008('Started Date From'))
        .optional()
        .if(value => !_.isNil(value) && value != '')
        .isDate({format: 'DD/MM/YYYY'}),
      check('startedDateTo', messages.EBT008('Started Date To'))
        .optional()
        .if(value => !_.isNil(value) && value != '')
        .isDate({format: 'DD/MM/YYYY'}),
      check('startedDateFrom')
        .optional({checkFalsy: true, nullable: true})
        .custom((value, {req}) => {
          if (
            !_.isNil(value) &&
            value != '' &&
            !_.isNil(req.query?.startedDateTo) &&
            req.query?.startedDateTo != '' &&
            !compareDate(value, req.query?.startedDateTo)
          ) {
            throw new Error(messages.EBT044);
          }
          return true;
        }),
    ];
  },

  add() {
    return [
      check('username')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('User Name'))
        .isLength({max: 100})
        .withMessage(username => {
          return messages.EBT002('User Name', 100, username.length);
        }),

      check('email')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Email'))
        .isLength({max: 255})
        .withMessage(email => {
          return messages.EBT002('Email', 255, email.length);
        })
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Email'))
        .custom(value => {
          const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        })
        .withMessage(messages.EBT005)
        .custom(async value => {
          const userRepository = getCustomRepository(UserRepository);
          const user = await userRepository.findByEmail(value);
          if (user) {
            throw new Error(messages.EBT019);
          }
        }),

      check('groupId')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Group')),

      check('startedDate')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Started Date'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Started Date'))
        .isDate({format: 'DD/MM/YYYY'})
        .withMessage(messages.EBT008('Started Date')),

      check('positionId')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Position')),

      check('password')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Password'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          if (value.length < 8 || value.length > 20) {
            return false;
          }
          return true;
        })
        .withMessage(messages.EBT023)
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Password'))
        .custom(value => {
          return /^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z]+$/.test(value);
        })
        .withMessage(messages.EBT025),

      check('passConfirm')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Password Confirmation'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Password Confirmation'))
        .custom((value, {req}) => {
          return req.body.password != '' && value === req.body.password
            ? true
            : false;
        })
        .withMessage(messages.EBT030),
    ];
  },

  edit() {
    return [
      check('username')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('User Name'))
        .isLength({max: 100})
        .if(value => !_.isNil(value) && value != '')
        .withMessage(username => {
          return messages.EBT002('User Name', 100, username.length);
        }),

      check('email')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Email'))
        .isLength({max: 255})
        .withMessage(email => {
          return messages.EBT002('Email', 255, email.length);
        })
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Email'))
        .custom(value => {
          const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        })
        .withMessage(messages.EBT005)
        .custom(async (value, {req}) => {
          const userRepository = getCustomRepository(UserRepository);
          const user = await userRepository.findByEmail(value);
          if (user && user.id != req.params?.id) {
            throw new Error(messages.EBT019);
          }
        }),

      check('groupId')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Group')),

      check('startedDate')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Started Date'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Started Date'))
        .isDate({format: 'DD/MM/YYYY'})
        .withMessage(messages.EBT008('Started Date')),

      check('positionId')
        .not()
        .isEmpty()
        .trim()
        .withMessage(messages.EBT001('Position')),

      check('password')
        .custom((value, {req}) => {
          return req.body.passConfirm != '' && value == '' ? false : true;
        })
        .withMessage(messages.EBT001('Password'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          if (value.length < 8 || value.length > 20) {
            return false;
          }
          return true;
        })
        .withMessage(messages.EBT023)
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Password'))
        .custom(value => {
          return /^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z]+$/.test(value);
        })
        .withMessage(messages.EBT025),

      check('passConfirm')
        .custom((value, {req}) => {
          return req.body.password != '' && value == '' ? false : true;
        })
        .withMessage(messages.EBT001('Password Confirmation'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
        })
        .withMessage(messages.EBT004('Password Confirmation'))
        .custom((value, {req}) => {
          return req.body.password != '' && value === req.body.password
            ? true
            : false;
        })
        .withMessage(messages.EBT030),
    ];
  },
};

export default userValidator;
