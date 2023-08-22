import {Request, Response} from 'express';
import {GroupRepository} from '../repositories/group.repository';
import {getCustomRepository} from 'typeorm';
import {emptyStringAsNull, numberOfPages} from '../middlewares/viewHelper';
import * as fs from 'fs';
import _ from 'lodash';
import groupValidator from '../validators/group.validator';
import {messages} from '../constants';

/**
 * GET list
 */
export const list = async (req: Request, res: Response) => {
  const errorMessages = (req.session as any)?.importMessage;
  delete (req.session as any).importMessage;
  try {
    const successMessage = (req.session as any)?.message;
    delete (req.session as any).message;

    const page = Number(req.query.page) || 1;

    const resultsPerPage = Number(process.env.LIMIT) || 10;
    const offset = (page - 1) * resultsPerPage;

    const groupRepository = getCustomRepository(GroupRepository);
    const groups = await groupRepository.findAll(offset, resultsPerPage);

    let message = '';

    const numOfResults = groups.count || 0;
    const numOfPages = Math.ceil(numOfResults / resultsPerPage);

    message = numOfResults > 0 ? '' : 'No Group Found';

    const pages = numberOfPages(numOfResults, page);

    res.render('group/list', {
      groups: groups.data,
      numOfPages: numOfPages,
      page: page,
      message: message,
      numOfResults: numOfResults,
      pages: pages,
      errorMessages: errorMessages ? errorMessages : '',
      successMessage: successMessage ? successMessage : '',
    });
  } catch (error) {
    res.render('group/list', {
      groups: [],
      numOfPages: 0,
      page: 0,
      message: 'No Group Found',
      numOfResults: 0,
      pages: 0,
      errorMessages: errorMessages ? errorMessages : '',
      successMessage: '',
    });
  }
};

/**
 * POST import
 */
export const importCSV = async (req: Request, res: Response) => {
  try {
    let errorMessages = (req.session as any)?.message;
    delete (req.session as any).message;

    if (errorMessages) {
      res.render('group/list', {
        groups: undefined,
        numOfPages: undefined,
        page: undefined,
        message: '',
        numOfResults: undefined,
        pages: undefined,
        errorMessages,
      });
    }

    const csvFilePath = req.file?.path;

    const fileContent = await fs.readFileSync(csvFilePath!, {
      encoding: 'utf-8',
    });
    fs.unlinkSync(csvFilePath!);

    const lines = fileContent.split('\n');

    const records: any = [];

    _.forEach(lines, function(line) {
      line = line.replace(/['"]+/g, '');
      const data = line.split(',');
      records.push(data);
    });

    // check validation all records
    const validate = groupValidator.import(records);

    errorMessages = (await validate).errorMessages;

    const data = (await validate).data;

    const goodData: any = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] == '') {
        goodData.push({
          id: emptyStringAsNull(data[i][0]),
          name: data[i][1],
          note: emptyStringAsNull(data[i][2]),
          groupLeaderId: data[i][3],
          groupFloorNumber: data[i][4],
          deletedDate: null,
        });
        goodData[i].createdDate = new Date();
        goodData[i].updatedDate = new Date();
      } else {
        if (data[i][5].trim() == 'Y') {
          goodData.push({
            id: emptyStringAsNull(data[i][0]),
            deletedDate: new Date(),
          });
        } else {
          goodData.push({
            id: emptyStringAsNull(data[i][0]),
            name: data[i][1],
            note: emptyStringAsNull(data[i][2]),
            groupLeaderId: data[i][3],
            groupFloorNumber: data[i][4],
            deletedDate: null,
          });
          goodData[i].updatedDate = new Date();
        }
      }
    }

    (req.session as any).importMessage = errorMessages;

    if (!(errorMessages.length > 0)) {
      const groupRepository = getCustomRepository(GroupRepository);
      await groupRepository.import(goodData);

      (req.session as any).message = messages.EBT092;
    }

    return res.end();
  } catch (error) {
    return res.end();
  }
};
