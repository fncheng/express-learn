var express = require('express');
const expressWs = require('express-ws');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const { resolve } = require('path');
const multer = require('multer');
const path = require('path');
var router = express.Router();
const log = console.log.bind(console);
expressWs(router);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uplaodPath = path.join(__dirname, 'uploads');

    // 如果上传目录不存在，则创建该目录
    if (!fs.existsSync(uplaodPath)) [fs.mkdirSync(uplaodPath, { recursive: true })];
    cb(null, uplaodPath);
  },
  filename: (req, res, cb) => {
    // 通过 Date.now() 和文件原始名称生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});
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
  `;
  res.status(200).send(htmlContent);
});

router.get('/index', (req, res, next) => {
  res.render('index', { title: 'Something!' });
});
router.get('/about', (req, res) => {
  res.send({
    name: 'zs'
  });
});
router.get('/route', (req, res) => {
  console.log('收到请求：', req.url);
  res.setTimeout(2000, () => {
    res.status(200).send({
      data: [
        { path: '/', name: 'Home', component: 'Home' },
        { path: '/about', name: 'About', component: 'About' }
      ]
    });
  });
  // res.status(200).send({
  //   data: [
  //     { path: '/', name: 'Home', component: 'Home' },
  //     { path: '/about', name: 'About', component: 'About' }
  //   ]
  // })
});

// nodejs实现SSE
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: Connected\n\n');

  // 定期发送数据
  const intervalId = setInterval(() => {
    const data = new Date().toLocaleTimeString();
    res.write(`data: ${data}\n\n`);
  }, 1000);

  // 处理客户端关闭连接
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password && username === 'admin' && password === 'admin') {
    res.status(200).send({
      code: 200,
      data: {
        msg: 'success'
      }
    });
  } else if (username === '123' && password === '123') {
    res.status(200).send({
      code: 401,
      msg: '登录失败'
    });
  } else
    res.status(401).send({
      msg: '未授权'
    });
});

router.get('/file', (req, res) => {
  const filePath = resolve(__dirname, '../public/index.html');
  console.log('filePath: ', filePath);
  res.status(200).setHeader('Content-Type', 'text/html').sendFile(filePath, {
    // headers: {
    // 'Content-Type': 'text/html',
    // "Content-Disposition": 'attachment;filename=FileName.html'
    // }
  });
});

router.ws('/socketTest', function (ws, req) {
  ws.send('恭喜你连接成功了');
  ws.onopen = (msg) => {
    console.log('open', msg);
  };
  ws.onmessage = (msg) => {
    ws.send('Hi', msg);
  };
});

router.post('/file/upload', (req, res) => {
  // res.json(req.file);
  log(req.files, req.file, req.body);
    res.status(200).json({
      messsage: 'File uploaded successfully',
      fileName: '123.png',
      filePath: path.join('uploads', req.body)
    });
  // if (req.file) {
  //   res.status(200).json({
  //     messsage: 'File uploaded successfully',
  //     fileName: req.file.filename,
  //     filePath: path.join('uploads', req.file.filename)
  //   });
  // } else {
  //   res.status(400).json({ message: 'File upload failed' });
  // }
  // res.pipe(
  //   fs.createWriteStream('../assets/' + req.url, {
  //     encoding: 'utf8'
  //   })
  // );
  // res.end(`${req.url} done!`);
});

const wss = new WebSocketServer({
  port: 3001
});
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.onopen = () => {
    console.log('websocket 服务 open');
  };
  ws.on('message', (data) => {
    console.log('received %s', data, data === 'hello');
    if (data == 'hello') {
      console.log('收到了消息:', data);
      // ws.send('收到了消息hello')
    }
  });

  ws.send('something');
});

module.exports = router;
