/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 *
 * @param someObj
 * @param replaceValue
 */

/**
 * TODO
 * @param someObj
 * @param replaceValue
 */
export const replaceEmptyString = (someObj: any, replaceValue: any) => {
  const replacer = (key: any, value: any) =>
    String(value) === '' ? replaceValue : value;

  return JSON.parse(JSON.stringify(someObj, replacer));
};

/**
 * Convert string -> number of properties (type=number)
 * @param someObj
 * @param types
 */
export const replaceNumber = (someObj: any, types: any) => {
  const replacer = (key: any, value: any) =>
    typeof types.definition &&
    types.definition.properties[key] &&
    (types.definition.properties[key].type == 'number' ||
      types.definition.properties[key].type == 'interger')
      ? value && !isNaN(value)
        ? Number(value)
        : null
      : value;

  return JSON.parse(JSON.stringify(someObj, replacer));
};

/**
 * TODO
 * @param someObj
 * @param replaceValue
 */
export const replaceEmptyStringRequired = (
  someObj: any,
  replaceValue: any,
  types: any,
) => {
  const replacer = (key: any, value: any) =>
    typeof types.definition &&
    types.definition.properties[key] &&
    types.definition.properties[key].type == 'string' &&
    types.definition.properties[key].required &&
    String(value) === ''
      ? replaceValue
      : value;

  return JSON.parse(JSON.stringify(someObj, replacer));
};
