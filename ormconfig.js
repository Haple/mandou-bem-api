// Configs to run migrations with TypeORM CLI

module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASS,
    "database": process.env.POSTGRES_DATABASE,
    // Uncomment if you want to run the migrations in the production database
    // "ssl": {
    //   "rejectUnauthorized": false,
    // },
    "entities": [
      "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  }
];
