/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ViewHelper Middlewares
 */
import Big from 'big.js';
import { NextFunction, Request, Response } from 'express';
import { valueLst, messages } from '../constants';
import moment from 'moment';

// tslint:disable-next-line:max-func-body-length
export default async (req: Request, res: Response, next: NextFunction) => {
  res.locals.valueLst = valueLst;
  res.locals.messageLst = messages;
  res.locals.loginUser = req.user;

  /*
   * string truncate
   */
  let length = 20;
  if (process.env.MIN_TRUNCATE_LENGTH !== undefined) {
    length = parseInt(process.env.MIN_TRUNCATE_LENGTH, 10);
  }
  const truncate = (s: string | null | undefined, maxlength: number) => {
    if (maxlength) {
      if (s !== null && s !== undefined && s.length > maxlength) {
        return `${s.substr(0, maxlength)}...`;
      } else {
        return s;
      }
    }
    if (s !== null && s !== undefined && s.length > length) {
      return `${s.substr(0, length)}...`;
    } else {
      return s;
    }
  };
  res.locals.truncate = truncate;

  /**
   * nl2br
   */
  function nl2br(str: string, isXhtml = false) {
    if (str === undefined || str === null) {
      return '';
    }
    const breakTag = isXhtml ? '<br />' : '<br>';
    return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
  }
  res.locals.nl2br = nl2br;

  /**
   * format number 000,000
   */
  function addCommaToNumber(x: string | number) {
    try {
      const amount = new Big(x).toFixed();
      const parts = amount.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (parts[1] !== undefined) {
        parts[1] = parts[1].slice(0, 2);
      }
      return parts.join('.');
    } catch (_) {
      return '';
    }
  }

  res.locals.addCommaToNumber = addCommaToNumber;

  /**
   * function to set checkbox checked state based on user's search condition
   * @param searchQuery list of option which user checked when doing search
   * @param optionValue the target checkbox's value, to be check
   * @param isDefault is this checkbox default to be checked
   */
  function isChecked(
    searchQuery: object | string | string[] | undefined,
    optionValue: string,
    isDefault = false,
  ) {
    if (searchQuery === undefined || searchQuery === null) {
      return isDefault ? 'checked' : '';
    } else if (
      searchQuery instanceof Array &&
      searchQuery.indexOf(optionValue) >= 0
    ) {
      return 'checked';
    } else if (searchQuery.toString() === optionValue.toString()) {
      return 'checked';
    } else {
      return '';
    }
  }
  res.locals.isChecked = isChecked;

  /**
   * function to set dropdownlist selected state based on user's search condition
   * @param searchQuery list of option which user checked when doing search
   * @param optionValue the target option's value, to be check
   * @param isDefault is this option default to be selected
   */
  function isSelected(
    searchQuery: string | string[] | undefined,
    optionValue: string,
    isDefault = false,
  ) {
    if (searchQuery === undefined) {
      return isDefault ? 'selected' : '';
    } else if (
      searchQuery instanceof Array &&
      searchQuery.indexOf(optionValue) >= 0
    ) {
      return 'selected';
    } else if (searchQuery === optionValue) {
      return 'selected';
    } else {
      return '';
    }
  }
  res.locals.isSelected = isSelected;

  /**
   * Display date under a specific format
   * @param format
   * @param date
   */
  function toStringDate(
    date?: string | Date,
    format?: string,
  ): string | undefined {
    format = format || 'YYYY/MM/DD';
    return date ? moment(date).format(format) : date;
  }
  res.locals.toStringDate = toStringDate;

  /**
   * Display date-time under a specific format
   * @param format
   * @param date
   */
  function toStringDatetime(
    date?: string | Date,
    format?: string,
  ): string | undefined {
    format = format || 'YYYY/MM/DD HH:mm:ss';
    return date ? moment(date).format(format) : date;
  }
  res.locals.toStringDatetime = toStringDatetime;

  next();
};

/**
 * trim spaces in search queries
 * @param searchQuery list of search strings
 */
export const trimQueries = (searchQuery: any) => {
  const clone = { ...searchQuery };

  for (const key of Object.keys(clone)) {
    if (clone[key]) {
      clone[key] = clone[key].trim();
    }
  }

  return clone;
};

/**
 * display database field under text instead of its number value
 * 1 -> value 1
 * 2 -> value 2
 * @param value
 * @param valueLst
 */
export const valueToText = (
  value: string | number | undefined,
  valueLst: any,
) => {
  if (value === null || value === undefined) {
    return value;
  } else {
    return valueLst[value];
  }
};

/**
 * return null if string is empty
 * @param value string
 */
export const emptyStringAsNull = (value: string) =>
  value.length > 0 ? value : null;
