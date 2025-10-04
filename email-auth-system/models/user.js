'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password:DataTypes.STRING,
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    blockedTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};