var express = require('express')
const expressWs = require('express-ws')
var router = express.Router()
expressWs(router)

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.get('/index', (req, res, next) => {
  res.render('index', { title: 'Something!' })
})
router.get('/about', (req, res) => {
  res.send({
    name: 'zs'
  })
})
router.get('/route', (req, res) => {
  res.status(200).send({
    data: [
      { path: '/', name: 'Home', component: 'Home' },
      { path: '/about', name: 'About', component: 'About' }
    ]
  })
})

router.ws('/socketTest', function (ws, req) {
  ws.send('恭喜你连接成功了')
  ws.onopen = (msg) => {
    console.log('open', msg)
  }
  ws.onmessage = (msg) => {
    ws.send('Hi', msg)
  }
})

module.exports = router
