require('dotenv').config({ path: '../.env' });

module.exports = {
  client: 'pg',
  connection: {
    user: process.env.DATABASE_USER,
    database: 'salute-photos',
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
  },
  migrations: {
    directory: './migrations',
  },
  useNullAsDefault: true,
};
