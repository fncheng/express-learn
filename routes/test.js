const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
  res.send({
    name: 'zs'
  })
})
router.get('/err', (req, res) => {
  res.status(200).send({
    code: 404,
    data: {
      msg: 'error'
    }
  })
})
router.get('/pic', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/images/数据导入样式.xlsx'))
})

router.post('/add', (req, res) => {
  console.log('payload', req.body)
  res.send({
    code: 200,
    data: 'success'
  })
})

module.exports = router
