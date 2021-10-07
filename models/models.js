const sequelize = require('../db')
const { DataTypes, BOOLEAN} = require('sequelize')

const User = sequelize.define('user_file', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  nickName: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
})

const File = sequelize.define('file', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  fileName: { type: DataTypes.STRING },
  privateStatus: {type: DataTypes.BOOLEAN},
})

const Access = sequelize.define('access', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

User.belongsToMany(File, {through: Access})
File.belongsToMany(User, {through: Access})

module.exports = {
  User,
  File,
  Access
}