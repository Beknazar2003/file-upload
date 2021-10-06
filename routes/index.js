const Router = require('express')
const router = new Router()
const fileRouter = require('./fileRouter')
const userRouter = require('./userRouter')
const path = require("path");

router.use('/auth', userRouter)
router.use('/file', fileRouter)

module.exports = router