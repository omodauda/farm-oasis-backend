'use strict';
const { async } = require('regenerator-runtime');
import bcrypt from 'bcryptjs';
const {
  Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auth.hasOne(models.User, {
        foreignKey: 'authId',
        allowNull: false,
        onDelete: 'CASCADE'
      })
    }
  };
  Auth.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isVerified: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    confirmToken: {
      type: DataTypes.INTEGER,
    },
    resetToken: {
      type: DataTypes.INTEGER
    },
  }, {
    hooks: {
      beforeCreate: async(user, options) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
      }
    },
    sequelize,
    modelName: 'Auth',
  });
  return Auth;
};