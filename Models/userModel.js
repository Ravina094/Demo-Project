const bcrypt = require("bcrypt");

/**
 * Defines the User model for the application.
 * This model represents a user in the system, which includes fields for authentication and social login.
 *
 * @param {Sequelize} sequelize - The Sequelize instance to define the model with.
 * @param {DataTypes} DataTypes - The data types provided by Sequelize to define the model attributes.
 * @returns {Model} The defined User model.
 *
 * @module UserModel
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      // Hook that runs before a User instance is created.
      // If the password is provided, it hashes the password before storing it.
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
