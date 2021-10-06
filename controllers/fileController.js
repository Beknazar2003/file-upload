const { User , File} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken")
const path = require('path')
const uuid = require('uuid')

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
        userFileId: id
      })
      return res.json(newFile)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    const accessFiles = await File.findAndCountAll({where: {userFileId: id}})
    const allFiles = await File.findAndCountAll({where: {privateStatus: false}})
    const reply = {
      accessFiles,
      allFiles
    }
    return res.json(reply)
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
