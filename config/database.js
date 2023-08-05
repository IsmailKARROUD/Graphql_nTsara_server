import { Sequelize } from "sequelize";
import dbConfig from "./config.js";

const env = process.env.NODE_ENV || "development";

const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export { sequelize };