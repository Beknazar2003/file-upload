const { User , File , Access} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken")
const path = require('path')
const uuid = require('uuid')
const {where} = require("sequelize");

class fileController {
  async uploadFile(req, res, next) {
    try {
      let { title, privateStatus} = req.body
      let { file } = req.files

      const extname = path.extname(file.name)
      const fileName = uuid.v4() + extname
      file.mv(path.resolve(__dirname, '..', 'static', fileName))

      const token = req.headers.authorization.split(' ')[1]
      const { id } = jwt.verify(token, process.env.SECRET_KEY)
      const newFile = await File.create({
        title,
        fileName,
        privateStatus,
      })
      await Access.create({userFileId: id , fileId: newFile.id})
      return res.json(newFile)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    if(req.headers.authorization === undefined) return res.json('Пользатель не авторизован')
    const token = req.headers.authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    const accessFilesId = await Access.findAndCountAll( {where: {userFileId: id}} )
    const accessFiles = await File.findAndCountAll({where: {id: accessFilesId.rows.map(item => {return item.fileId})}})
    const allFiles = await File.findAndCountAll({where: {privateStatus: false}})
    return res.json({
      accessFiles,
      allFiles
    })
  }
  
  async getOne(req, res) {
    const { id } = req.params
    const file = await File.findOne({
      where: { id },
    })
    if(file.privateStatus){
      const token = req.headers.authorization.split(' ')[1]
      const { id } = jwt.verify(token, process.env.SECRET_KEY)
      let reply
      file.userFileId === id ? reply = file : reply = 'У вас нет доступа'
      return res.json(reply)
    }
    return res.json(file)
  }
  async download(req, res) {
    const { id } = req.params
    const file = await File.findOne({
      where: { id },
    })
    if(file.privateStatus){
      if(req.headers.authorization === undefined) return res.json('Пользатель не авторизован')
      const token = req.headers.authorization.split(' ')[1]
      const { id } = jwt.verify(token, process.env.SECRET_KEY)
      if(file.userFileId === id) {
        return res.download(path.resolve(__dirname, '..', 'static', file.fileName))
      } else res.json('У вас не доступа')
    }
    return res.download(path.resolve(__dirname, '..', 'static', file.fileName), file.fileName)
  }
}

module.exports = new fileController()
