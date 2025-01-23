import express, { Request, Response } from 'express'
import cors from 'cors'
import logger from 'morgan'
import numberRouter from './routes/number'
import nameRouter from './routes/name'
import uploadRouter from './routes/upload'
import chunkRouter from './routes/chunk'
import './middlewares/multer'

const app = express()
const port = 3000

// 使用中间件解析 JSON 请求体
app.use(express.json())
app.use(cors())
app.use(logger('dev'))

app.use('/', numberRouter)
app.use('/', nameRouter)
app.use('/', uploadRouter)
app.use('/', chunkRouter)

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
