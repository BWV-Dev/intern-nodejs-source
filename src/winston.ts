import  {createLogger, format} from 'winston';
import moment = require('moment-timezone');
const { combine, printf} = format;

/**
 * winston logger configuration
 * levels: fatal, error, warning, info, debug
 * format: [Timestamp][log level][IP][sessionID][userID][message]
 */
const logger = createLogger({
  format: combine(
    printf((info: { level: string; message: any; }) => {
      if (info && info.level == 'warn') {
        return `[${moment()
          .tz('Asia/Tokyo')
          .format()}][WARNING]${info.message}`;
      } else {
        return `[${moment()
          .tz('Asia/Tokyo')
          .format()}][${info.level.toUpperCase()}]${info.message}`;
      }
    }),
  ),
  transports: [
    new (require('winston-daily-rotate-file'))({
      timestamp: () => `[${(moment().format())}]`,
      datePattern: 'YYYYMMDD',
      filename: `application_%DATE%.log`,
      dirname: 'logs'
    }),
  ],
  exitOnError: false,
});
 
export default logger;