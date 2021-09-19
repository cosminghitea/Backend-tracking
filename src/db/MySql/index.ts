import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import UserModel from './Models/UserModel';

const db: any = {};

export default db;

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    database: process.env.DB_DATABASE || '',
  };

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
  });

  db.User = UserModel(sequelize);

  await sequelize.sync();
}

initialize();
