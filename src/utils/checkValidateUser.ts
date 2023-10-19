/* eslint-disable @typescript-eslint/camelcase */
import * as _ from 'lodash';

import {messages} from '../constants';

export const checkValidateAddUser = (
  name: string,
  email: string,
  role: string,
  password: string,
  passwordConfirmation: string,
): string[] | null => {
  const errorList: string[] = [];

  const halfwidth = /^[\u0020-\u007E\uFF61-\uFF9F]+$/;
  // validate username
  if (name.length == 0) {
    errorList.push(messages.ECL001('User Name'));
  }

  if (name.length > 100) {
    errorList.push(messages.ECL002('User Name', 100, name.length));
  }

  if (name.length > 0 && name.length <= 100) {
    if (!halfwidth.test(name)) {
      errorList.push(messages.ECL004('User Name'));
    }
  }

  // validate email
  if (email.length == 0) {
    errorList.push(messages.ECL001('Email'));
  }
  if (email.length > 255) {
    errorList.push(messages.ECL002('Email', 255, email.length));
  }
  if (email.length > 0 && email.length <= 255) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!mailFormat.test(email)) {
      errorList.push(messages.ECL005);
    } else if (email.length > 0 && email.length <= 255) {
      if (!halfwidth.test(email)) {
        errorList.push(messages.ECL004('Email'));
      }
    }
  }

  // validate division
  if (!role) {
    errorList.push(messages.ECL001('Role'));
  }

  // validate password
  if (password.length == 0) {
    errorList.push(messages.ECL001('Password'));
  } else {
    if (password.length < 8 || password.length > 20) {
      errorList.push(messages.ECL023);
    } else if (password.length > 0 && password.length <= 20) {
      if (!halfwidth.test(password)) {
        errorList.push(messages.ECL004('Password'));
      }
    }
  }

  // validate password confirmation
  if (passwordConfirmation.length == 0) {
    errorList.push(messages.ECL001('Password Confirmation'));
  } else {
    if (password !== passwordConfirmation) {
      errorList.push(messages.ECL030);
    } else if (passwordConfirmation.length > 20) {
      errorList.push(
        messages.ECL002(
          'Password Confirmation',
          20,
          passwordConfirmation.length,
        ),
      );
    }
  }

  if (passwordConfirmation.length > 0 && passwordConfirmation.length <= 20) {
    if (!halfwidth.test(passwordConfirmation)) {
      errorList.push(messages.ECL004('Password Confirmation'));
    }
  }

  const isError = errorList.length === 0 ? true : false;

  if (isError) {
    return null;
  } else {
    return errorList;
  }
};

export const checkValidateUpdateUser = (
  name: string,
  email: string,
  division_id: any,
  entered_date: string,
  position_id: any,
  password: string,
  passwordConfirmation: string,
): string[] | null => {
  const errorList: string[] = [];

  const halfwidth = /^[\u0020-\u007E\uFF61-\uFF9F]+$/;
  // validate username
  if (name.length == 0) {
    errorList.push(messages.ECL001('User Name'));
  }

  if (name.length > 100) {
    errorList.push(messages.ECL002('User Name', 100, name.length));
  }

  if (name.length > 0 && name.length <= 100) {
    if (!halfwidth.test(name)) {
      errorList.push(messages.ECL004('User Name'));
    }
  }

  // validate email
  if (email.length == 0) {
    errorList.push(messages.ECL001('Email'));
  }
  if (email.length > 255) {
    errorList.push(messages.ECL002('Email', 255, email.length));
  }
  if (email.length > 0 && email.length <= 255) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!mailFormat.test(email)) {
      errorList.push(messages.ECL005);
    } else if (email.length > 0 && email.length <= 255) {
      if (!halfwidth.test(email)) {
        errorList.push(messages.ECL004('Email'));
      }
    }
  }

  // validate division
  if (division_id.length == 0) {
    errorList.push(messages.ECL001('Division'));
  }

  // validate entered date
  if (entered_date.length == 0) {
    errorList.push(messages.ECL001('Entered Date'));
  }

  if (entered_date.length > 0) {
    if (!halfwidth.test(entered_date)) {
      errorList.push(messages.ECL004('Entered Date'));
    }
  }

  // validate division
  if (position_id.length == 0) {
    errorList.push(messages.ECL001('Position'));
  }

  // validate password

  if (password.length > 0 && (password.length < 8 || password.length > 20)) {
    errorList.push(messages.ECL023);
  } else if (password.length > 0 && password.length <= 20) {
    if (!halfwidth.test(password)) {
      errorList.push(messages.ECL004('Password'));
    }
  }

  // validate password confirmation

  if (password.length > 0 && passwordConfirmation.length == 0) {
    errorList.push(messages.ECL001('Password Confirmation'));
  } else {
    if (password !== passwordConfirmation) {
      errorList.push(messages.ECL030);
    } else if (passwordConfirmation.length > 20) {
      errorList.push(
        messages.ECL002(
          'Password Confirmation',
          20,
          passwordConfirmation.length,
        ),
      );
    }
  }

  if (passwordConfirmation.length > 0 && passwordConfirmation.length <= 20) {
    if (!halfwidth.test(passwordConfirmation)) {
      errorList.push(messages.ECL004('Password Confirmation'));
    }
  }

  const isError = errorList.length === 0 ? true : false;

  if (isError) {
    return null;
  } else {
    return errorList;
  }
};
