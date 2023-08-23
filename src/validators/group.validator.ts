import * as _ from 'lodash';
import {messages} from '../constants';
import {GroupRepository} from '../repositories/group.repository';
import {getCustomRepository} from 'typeorm';
import {isBigInt} from '../middlewares/viewHelper';

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

const MAX_BIGINT = BigInt('9223372036854775807');
const MIN_BIGINT = BigInt('-9223372036854775808');

const groupValidator = {
  async import(records: []) {
    try {
      const data: any = [];

      const errorMessages: any = [];

      if (records.length <= 1) {
        errorMessages.push(messages.EBT036('[CSV Data]'));
        if (records.at(0)!['length'] == 1 && records.at(0)![0] == '') {
          return {errorMessages: errorMessages, data: data};
        }
      }

      // check header
      if (records.length > 0) {
        const header = (records.at(0)! as any[]).map(function(item) {
          item = item.trim();
          return item;
        });
        const check = _.join(Object.values(header), ',');
        const targetString =
          'ID,Group Name,Group Note,Group Leader,Floor Number,Delete';
        if (check !== targetString) {
          errorMessages.push(messages.EBT095);
        }
      }

      for (let i = 1; i < records.length; i++) {
        let check = true;
        let isDeleted = false;

        if (records[i]['length'] != 6) {
          errorMessages.push(messages.ErrorImport(i + 1, messages.EBT095));
          check = false;
        }

        for (let j = 0; j < records[i]['length']; j++) {
          switch (j) {
            case 0:
              if (records[i][j] != '') {
                if (isNaN(records[i][j]) || !isBigInt(records[i][j])) {
                  errorMessages.push(
                    messages.ErrorImport(i + 1, messages.EBT010('ID')),
                  );
                  check = false;
                } else if (
                  isBigInt(records[i][j]) &&
                  BigInt(records[i][j]) <= MAX_BIGINT &&
                  BigInt(records[i][j]) >= MIN_BIGINT
                ) {
                  // check exist
                  const groupRepository = getCustomRepository(GroupRepository);
                  const group = await groupRepository.findById(records[i][j]);
                  if (_.isNil(group)) {
                    errorMessages.push(
                      messages.ErrorImport(i + 1, messages.EBT094('ID')),
                    );
                    check = false;
                  } else if (
                    typeof records[i][5] === 'string' &&
                    (records[i][5] as string).trim() === 'Y'
                  ) {
                    isDeleted = true;
                  }
                } else if (records[i][j]['length'] > 19) {
                  errorMessages.push(
                    messages.ErrorImport(
                      i + 1,
                      messages.EBT002('ID', 19, records[i][j]['length']),
                    ),
                  );
                  check = false;
                }
              }
              break;
            case 1:
              if (!isDeleted) {
                if (records[i][j] == '') {
                  errorMessages.push(
                    messages.ErrorImport(i + 1, messages.EBT001('Group Name')),
                  );
                  check = false;
                } else {
                  if (records[i][j]['length'] > 255) {
                    errorMessages.push(
                      messages.ErrorImport(
                        i + 1,
                        messages.EBT002(
                          'Group Name',
                          255,
                          records[i][j]['length'],
                        ),
                      ),
                    );
                    check = false;
                  }
                }
              }
              break;
            case 3:
              if (!isDeleted) {
                if (records[i][j] == '') {
                  errorMessages.push(
                    messages.ErrorImport(
                      i + 1,
                      messages.EBT001('Group Leader'),
                    ),
                  );
                  check = false;
                } else {
                  // check bigint
                  if (isNaN(records[i][j]) || !isBigInt(records[i][j])) {
                    errorMessages.push(
                      messages.ErrorImport(
                        i + 1,
                        messages.EBT010('Group Leader'),
                      ),
                    );
                    check = false;
                  } else if (records[i][j]['length'] > 19) {
                    errorMessages.push(
                      messages.ErrorImport(
                        i + 1,
                        messages.EBT002(
                          'Group Leader',
                          19,
                          records[i][j]['length'],
                        ),
                      ),
                    );
                    check = false;
                  }
                }
              }
              break;
            case 4:
              if (!isDeleted) {
                if (records[i][j] == '') {
                  errorMessages.push(
                    messages.ErrorImport(
                      i + 1,
                      messages.EBT001('Floor Number'),
                    ),
                  );
                  check = false;
                } else {
                  // check int
                  if (
                    isNaN(records[i][j]) ||
                    !Number.isInteger(Number(records[i][j])) ||
                    (records[i][j] as string).includes('.')
                  ) {
                    errorMessages.push(
                      messages.ErrorImport(
                        i + 1,
                        messages.EBT010('Floor Number'),
                      ),
                    );
                    check = false;
                  } else if (records[i][j]['length'] > 9) {
                    errorMessages.push(
                      messages.ErrorImport(
                        i + 1,
                        messages.EBT002(
                          'Floor Number',
                          9,
                          records[i][j]['length'],
                        ),
                      ),
                    );
                    check = false;
                  }
                }
              }
              break;
            default:
              break;
          }
        }

        if (check) {
          data.push(records[i]);
        }
      }

      return {errorMessages: errorMessages, data: data};
    } catch (error) {
      return {errorMessages: messages.EBT090, data: []};
    }
  },
};

export default groupValidator;
