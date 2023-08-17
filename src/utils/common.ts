/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment-timezone';
import Big from 'big.js';

/**
 * Format date
 * @param date
 */
export const formatDate = (date: string | undefined, format: string) => {
  return date && !isNaN(<any>new Date(date)) ? moment(date).format(format) : '';
};

/**
 * addCommaToNumber
 * @param string
 */
export const addCommaToNumber = (x: string | number | null | undefined) => {
  if (x === null || x === undefined) {
    return '';
  }
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
};

/*
 * Concatenate string text
 */
export const combineText = (data: any[], char?: string) => {
  const arr = data.filter(d => d !== undefined && d !== null);

  if (arr.length === 0) {
    return null;
  }

  if (arr.join('') === '') {
    return null;
  }

  if (arr.length > 0) {
    if (char) {
      return arr.filter(d => d).join(char);
    } else {
      return arr.filter(d => d).join(' ');
    }
  } else {
    return null;
  }
};

/**
 * Display date under a specific format
 * @param format
 * @param date
 */
export function toStringDate(
  date?: string | Date,
  format?: string,
): string | undefined {
  format = format || 'YYYY/MM/DD';
  return date
    ? moment(date)
        .tz('Asia/Tokyo')
        .format(format)
    : date;
}

/**
 * Display date-time under a specific format
 * @param format
 * @param date
 */
export function toStringDatetime(
  date?: string | Date,
  format?: string,
): string | undefined {
  format = format || 'YYYY/MM/DD HH:mm:ss';
  return date
    ? moment(date)
        .tz('Asia/Tokyo')
        .format(format)
    : date;
}

/**
 * Get current system date time
 */
export function getCurrentSystemDatetime() {
  return moment()
    .tz('Asia/Tokyo')
    .format('YYYY/MM/DD HH:mm:ss');
}
