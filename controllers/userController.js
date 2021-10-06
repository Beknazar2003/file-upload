const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')

const generateJwt = (id, name) => {
  return jwt.sign({ id, name }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
}

class UserController {
  async registration(req, res, next) {
    console.log(req.body)
    const {name, nickName, password} = req.body
    if (!name || !password) {
      return next(ApiError.badRequest('Некорректный name или password!'))
    }
    const candidate = await User.findOne({ where: { name } })
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь с таким name уже существует')
      )
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      name,
      nickName,
      password: hashPassword,
    })
    const token = generateJwt(user.id, user.name)
    return res.json({ token })
  }

  async login(req, res, next) {
    const { name, password } = req.body
    const user = await User.findOne({ where: { name } })
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }
    const token = generateJwt(user.id, user.name)
    return res.json({ token, userId: user.id})
  }

  async check(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    const { name } = await User.findOne({
      where: { id },
    })

    return res.json({ name })
  }
}

module.exports = new UserController()