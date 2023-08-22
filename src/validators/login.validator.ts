import {check} from 'express-validator';
import * as _ from 'lodash';
import {messages} from '../constants';
import {UserRepository} from '../repositories/user.repository';
import {getCustomRepository} from 'typeorm';

const loginValidator = {
  login() {
    return [
      check('email')
        .not()
        .isEmpty()
        .withMessage(messages.EBT001('Email'))
        .if(value => !_.isNil(value) && value != '')
        .custom(value => {
          const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        })
        .withMessage(messages.EBT005),

      check('password', messages.EBT001('Password'))
        .not()
        .isEmpty(),
    ];
  },
};

export default loginValidator;
