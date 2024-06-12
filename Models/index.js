const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../Config/config.js").development;

/**
 * Creates a new Sequelize instance to connect to the database.
 */
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);

module.exports = db;
