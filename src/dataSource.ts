import {DataSource} from 'typeorm';
import logger from './winston';
import {config} from 'dotenv';

const env = process.env.NODE_ENV === 'local ' ? 'local' : 'development';

config({path: `env/${env}.env`});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: <number>(<unknown>process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: true,
  entities: ['dist/entities/*.entity.js'],
  subscribers: [],
  migrations: ['dist/migrations/*{.ts,.js}'],
  timezone: '+07:00',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected.')
    logger.info('Database connected.');
  })
  .catch(error => {
    console.log('Error when connection database.', error)
    logger.error(error);
    logger.error('Error establishing a database connection.');
  });
