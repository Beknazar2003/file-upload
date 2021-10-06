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

User.hasMany(File)
File.belongsToMany(User, {through: 'User'})

module.exports = {
  User,
  File
}