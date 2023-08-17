import {createConnection} from 'typeorm';
import logger from './winston';

createConnection({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: <number><unknown>process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/entities/*.entity.js'],
  synchronize: false,
  timezone: '+09:00',
})
.then((connection) => {
  logger.info('Database connected.');
})
.catch((error) => {
  logger.error(error);
  logger.error('Error establishing a database connection.');
});
