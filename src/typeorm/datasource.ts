import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './config';

export default new DataSource({
  ...typeOrmConfig,
  migrations: ['src/typeorm/migrations/*.ts'],
} as DataSourceOptions);
