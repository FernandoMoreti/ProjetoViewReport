import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  "dbyo",
  "root",
  "root",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;