import { Request, Response, Router } from 'express'
import path from 'path'
import fs from 'fs-extra'
import { upload, UPLOAD_DIR } from '../middlewares/multer'
import { sleep } from '../utils/index'

const router = Router()

/**
 * 上传文件
 */
router.post(
    '/upload/single',
    upload.single('file'),
    async (req: Request, res: Response) => {
        console.log('req: ', req.file)
        if (!req.file) {
            res.status(400).json({ message: 'No file part in the request' })
        }
        const file = req.file
        if (file) {
            // 相对路径转换成绝对路径
            const tempPath = path.resolve(file.path)
            console.log('tempPath: ', tempPath)
            const targetPath = path.resolve(__dirname, UPLOAD_DIR)
            const finalPath = path.resolve(__dirname, UPLOAD_DIR, file.filename)
            console.log('finalPath: ', finalPath)
            if (!fs.existsSync(finalPath)) {
                console.log('文件不存在')
                try {
                    await fs.ensureDir(targetPath)
                    await fs.move(tempPath, finalPath)
                    res.status(200).json({
                        message: 'File uploaded successfully'
                    })
                } catch (err) {
                    console.log('err: ', err)
                    res.status(500).json({ message: 'Error saving file' })
                }
            } else {
                console.log('文件已存在')
                res.status(200).json({ error: 'File already exists' })
            }
        }
    }
)

router.get('/status/:id', (req: Request, res: Response) => {
    const id = req.params.id
    if (id === '1') {
        res.status(200).json({ status: 'success' })
    } else if (id === '2') {
        res.status(200).json({ status: 'failed' })
    } else {
        res.status(200).json({ status: 'unknown' })
    }
})

/**
 * 删除文件
 */
router.post('/upload/delete', (req: Request, res: Response) => {
    const { id } = req.body
    res.status(200).json({ message: 'File deleted successfully' })
})

/**
 * 获取文件列表
 */
router.get('/upload/list', (req: Request, res: Response) => {
    const files = fs.readdirSync(path.resolve(__dirname, '../../audios/'))
    const list = files.map((f, i) => ({ id: i, audioName: f }))
    res.status(200).json({ data: list })
})

/**
 * 获取单个音频文件
 */
router.get('/audio/get/:audioId', async (req: Request, res: Response) => {
    const audioId = req.params.audioId
    const audioPath = path.join(__dirname, '../../audios/', `${audioId}.mp3`)

    if (fs.existsSync(audioPath)) {
        const fileSize = fs.statSync(audioPath).size
        res.status(200)
        res.setHeader('Content-Length', fileSize)
        res.setHeader('Content-Range', `bytes 0-${fileSize - 1}/${fileSize}`)
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${audioId}.mp3"`
        )
        res.setHeader('Accept-Ranges', 'bytes')

        // res.sendFile(audioPath)
        const fileStream = fs.createReadStream(audioPath)
        fileStream.pipe(res)
    } else {
        res.status(404).json({ error: 'File not found' })
    }
})

router.get('/test/getContent', (req, res) => {
    const content = {
        type: 16,
        transcriptResult:
            '{"ps":[{"lastPsRole":"","pTime":[970,15980],"role":"0","words":[{"modal":false,"rl":"0","text":"这个","time":[970,1120],"wp":"n"},{"modal":false,"rl":"0","text":"就","time":[1130,1240],"wp":"n"},{"modal":false,"rl":"0","text":"可以","time":[1250,1640],"wp":"n"},{"modal":false,"rl":"0","text":"了","time":[1690,2320],"wp":"n"},{"modal":false,"rl":"0","text":"，","time":[2370,2370],"wp":"p"},{"modal":false,"rl":"0","text":"叫","time":[2370,2560],"wp":"n"},{"modal":false,"rl":"0","text":"什么","time":[2570,3000],"wp":"n"},{"modal":false,"rl":"0","text":"？","time":[3640,3640],"wp":"p"},{"modal":false,"rl":"0","text":"产品","time":[3640,4230],"wp":"n"},{"modal":false,"rl":"0","text":"目标","time":[4240,4630],"wp":"n"},{"modal":false,"rl":"0","text":"是","time":[4640,4830],"wp":"n"},{"modal":false,"rl":"0","text":"打造","time":[4840,5350],"wp":"n"},{"modal":false,"rl":"0","text":"一个","time":[5360,5910],"wp":"n"},{"modal":false,"rl":"0","text":"用户","time":[5920,6350],"wp":"n"},{"modal":false,"rl":"0","text":"友好","time":[6360,6750],"wp":"n"},{"modal":false,"rl":"0","text":"的","time":[6760,6950],"wp":"n"},{"modal":false,"rl":"0","text":"前端","time":[6960,7310],"wp":"n"},{"modal":false,"rl":"0","text":"界面","time":[7360,7750],"wp":"n"},{"modal":false,"rl":"0","text":"，","time":[7760,7760],"wp":"p"},{"modal":false,"rl":"0","text":"用户","time":[7760,8190],"wp":"n"},{"modal":false,"rl":"0","text":"只需","time":[8200,8510],"wp":"n"},{"modal":false,"rl":"0","text":"上传","time":[8520,8910],"wp":"n"},{"modal":false,"rl":"0","text":"会议","time":[8920,9310],"wp":"n"},{"modal":false,"rl":"0","text":"音频","time":[9320,9670],"wp":"n"},{"modal":false,"rl":"0","text":"文件","time":[9680,10070],"wp":"n"},{"modal":false,"rl":"0","text":"，","time":[10330,10330],"wp":"p"},{"modal":false,"rl":"0","text":"即可","time":[10330,10840],"wp":"n"},{"modal":false,"rl":"0","text":"通过","time":[10850,11320],"wp":"n"},{"modal":false,"rl":"0","text":"智能","time":[11330,11560],"wp":"n"},{"modal":false,"rl":"0","text":"体","time":[11570,11720],"wp":"n"},{"modal":false,"rl":"0","text":"自动","time":[11730,12120],"wp":"n"},{"modal":false,"rl":"0","text":"生成","time":[12130,12520],"wp":"n"},{"modal":false,"rl":"0","text":"会议","time":[12530,12880],"wp":"n"},{"modal":false,"rl":"0","text":"纪要123","time":[12890,13440],"wp":"n"},{"modal":false,"rl":"0","text":"，","time":[15270,15270],"wp":"p"},{"modal":false,"rl":"0","text":"一模一样","time":[15270,15980],"wp":"n"}],"key":"39df8e84-ff0b-4471-888d-f25ed2e3d66c"}],"roles":[],"styles":[]}',
        saveTime: 1735635763000,
        version: 1735635763585,
        hjFrom: 25,
        languageType: 1
    }
    res.status(200).json(content)
})

router.get('/events', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const sendData = (event: string, data: string) =>
        `event: ${event}\ndata: ${data}\n\n`

    try {
        res.write(sendData('message', 'Connected'))
        await sleep(1000)
        res.write(
            sendData(
                'message',
                '\u53ef\u80fd\u4f1a\u5728\u540e\u7eed\u7684\u6570\u636e\u6e32\u67d3\u65f6\u51fa\u73b0\u4e0d\u5fc5\u8981\u7684\u91cd\u590d\u64cd\u4f5c\uff0c'
            )
        )
        await sleep(1000)
        res.write(
            sendData(
                'message',
                '如果你想要对消息进行更细粒度的控制，比如添加时间戳、作者信息等，可以将每个消息包装成一个更复杂的 HTML 元素。'
            )
        )
        await sleep(2000)
        res.write(sendData('message', '[DONE]'))
    } catch (err) {
        console.log('Client disconnected')
    }
})

export default router
