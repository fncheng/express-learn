var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/getdata', (req, res) => {
  setTimeout(() => {
    res.send({
      errCode: 1004001,
      msg: '',
      body: [{ name: 'zs', age: 20 }]
    })
  }, 100)
})

router.get('/getname', (req, res) => {
  setTimeout(() => {
    res.send({ code: 200, body: { name: 'zs' } })
  }, 4000)
})

module.exports = router
