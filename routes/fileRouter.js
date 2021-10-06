const Router = require('express')
const router = new Router()
const fileController = require('../controllers/fileController')

router.post('/', fileController.uploadFile)
router.get('/', fileController.getAll)
router.get('/:id', fileController.getOne)
router.get('/:id/download', fileController.download)

module.exports = router