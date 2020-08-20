import { createConnections } from 'typeorm';
import path from 'path';

createConnections([
  {
    name: 'default',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DATABASE,
    entities: [
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '**',
        'infra',
        'typeorm',
        'entities',
        '*.*',
      ),
    ],
    migrations: [
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '**',
        'infra',
        'typeorm',
        'migrations',
        '*.*',
      ),
    ],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT || '27017', 10),
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DATABASE,
    useUnifiedTopology: true,
    entities: [
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '**',
        'infra',
        'typeorm',
        'schemas',
        '*.*',
      ),
    ],
  },
]);
