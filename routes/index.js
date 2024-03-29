var express = require('express')
const expressWs = require('express-ws')
const { WebSocketServer } = require('ws')
const fs = require('fs')
const { resolve } = require('path')
var router = express.Router()
expressWs(router)

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})
router.get('/html', (req, res) => {
  const htmlContent = `
    <html>
      <head>
        <title>Example Page</title>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <p>This is an example page.</p>
      </body>
    </html>
  `
  res.status(200).send(htmlContent)
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

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username && password && username === 'admin' && password === 'admin') {
    res.status(200).send({
      code: 200,
      data: {
        msg: 'success'
      }
    })
  } else if (username === '123' && password === '123') {
    res.status(200).send({
      code: 401,
      msg: '登录失败'
    })
  } else
    res.status(401).send({
      msg: '未授权'
    })
})

router.get('/file', (req, res) => {
  const filePath = resolve(__dirname, '../public/index.html')
  console.log('filePath: ', filePath)
  res.status(200).setHeader('Content-Type', 'text/html').sendFile(filePath, {
    // headers: {
    // 'Content-Type': 'text/html',
    // "Content-Disposition": 'attachment;filename=FileName.html'
    // }
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

const wss = new WebSocketServer({
  port: 3001
})
wss.on('connection', function connection(ws) {
  ws.on('error', console.error)
  ws.onopen = () => {
    console.log('websocket 服务 open')
  }
  ws.on('message', (data) => {
    console.log('received %s', data, data === 'hello')
    if (data == 'hello') {
      console.log('收到了消息:', data)
      // ws.send('收到了消息hello')
    }
  })

  ws.send('something')
})

module.exports = router
