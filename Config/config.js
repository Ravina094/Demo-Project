/**
 * Load environment variables from a .env file into process.env.
 * This module reads the variables in the `.env` file and assigns them to `process.env`.
 * This allows us to use these variables in our code as needed.
 */
require("dotenv").config();

module.exports = {
  /**
   * Development environment configuration.
   * Contains the database connection settings for the development environment.
   *
   * @type {Object}
   * @property {string} username - The username for connecting to the database.
   * @property {string} password - The password for the database user.
   * @property {string} database - The name of the database to connect to.
   * @property {string} host - The hostname of the database server.
   * @property {string} dialect - The type of SQL dialect being used (in this case, MySQL).
   */
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
