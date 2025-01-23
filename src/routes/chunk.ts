import { Request, Response, Router } from 'express'
import { sleep } from '../utils'
import { upload } from '../middlewares/multer'
import path from 'path'
import fs from 'fs-extra'

const router = Router()

router.get('/test/getPieData', async (req, res) => {
    await sleep(2000)
    let data = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
    ]
    res.json({ data })
})

router.get('/getNodes', async (req, res) => {
    const node = req.query.node
    await sleep(1000)
    let nodes = []
    if (node === 'zhejiang') {
        nodes = [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                leaf: true
            },
            {
                value: 'shaoxing',
                label: 'Shaoxing',
                leaf: true
            }
        ]
    } else if (node === 'jiangsu') {
        nodes = [
            {
                value: 'nanjing',
                label: 'Nanjing',
                leaf: true
            },
            {
                value: 'xuzhou',
                label: 'Xuzhou',
                leaf: true
            }
        ]
    } else {
        nodes = [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                leaf: false
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                leaf: false
            }
        ]
    }
    res.json({ nodes })
})

/**
 * 上传分片
 */
router.post('/upload', upload.single('chunk'), async (req, res) => {
    const chunk = req.file
    let chunkIndex = req.body.chunkIndex
    const fileHash = req.body.fileHash
    if (!chunk || !chunkIndex || !fileHash) {
        res.status(400).json({ message: 'Invalid request' })
    } else {
        chunkIndex = Number(chunkIndex)
        const chunkFileName = `${chunkIndex}.part`
        const tempPath = path.resolve(chunk.path)
        const finalDir = path.resolve(__dirname, '../../uploads/', fileHash)
        const finalPath = path.resolve(finalDir, chunkFileName)
        console.log('finalPath: ', finalPath)
        try {
            await fs.ensureDir(finalDir)
            await fs.move(tempPath, finalPath, { overwrite: true })
            res.status(200).json({ message: 'Chunk uploaded successfully' })
        } catch (err) {
            console.log('err: ', err)
            res.status(500).json({ message: 'Error saving chunk' })
        }
    }
})

/**
 * 检查分片
 */
router.get(
    '/upload/check',
    (req: Request<{}, {}, {}, { fileHash: string }>, res: Response) => {
        const fileHash = req.query.fileHash
        const chunkDir = path.resolve(__dirname, '../../uploads/', fileHash)
        const outputDir = path.resolve(
            __dirname,
            '../../merged_files/',
            fileHash
        )
        if (fs.existsSync(outputDir)) {
            res.status(200).json({ message: 'File already exists' })
        } else {
            if (!fs.existsSync(chunkDir)) {
                fs.mkdirSync(chunkDir)
            }
            let chunk_indices: number[] = []
            fs.readdirSync(chunkDir).forEach((filename) => {
                try {
                    const index = parseInt(filename.split('.')[0], 10)
                    console.log('index***', index)
                    chunk_indices.push(index)
                } catch (error) {
                    // Ignore filenames that cannot be converted to an integer
                }
            })
            console.log('*****', chunk_indices)
            res.status(200).json(chunk_indices.sort((a, b) => a - b))
        }
    }
)

/**
 * 合并分片
 */

router.post('/upload/merge', async (req, res) => {
    const fileHash = req.body.fileHash
    const fileName = req.body.fileName
    const outputDir = path.resolve(__dirname, '../../merged_files/', fileHash)
    const chunkDir = path.resolve(__dirname, '../../uploads/', fileHash)
    const finalPath = path.resolve(
        __dirname,
        '../../merged_files/',
        fileHash,
        fileName
    )
    try {
        if (!fs.existsSync(outputDir)) {
            console.log('mkdir目录')
            fs.mkdirsSync(outputDir)
        }
        const chunkFiles = (await fs.readdir(chunkDir))
            .filter((f) => f.endsWith('.part'))
            .sort(
                (a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0])
            )
        const writeStream = fs.createWriteStream(finalPath)
        for (const chunkFile of chunkFiles) {
            const chunkPath = path.resolve(chunkDir, chunkFile)
            const readStream = fs.createReadStream(chunkPath)
            readStream.pipe(writeStream, { end: false })
            await new Promise((resolve, reject) => {
                readStream.on('end', resolve)
                readStream.on('error', reject)
            })
        }
        writeStream.end()
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve)
            writeStream.on('error', reject)
        })
        // 删除所有切片文件
        for (const chunkFile of chunkFiles) {
            const chunkPath = path.resolve(chunkDir, chunkFile)
            await fs.promises.unlink(chunkPath)
        }
        // 删除切片目录
        await fs.promises.rmdir(chunkDir)
        res.status(200).json({ message: 'File merged successfully' })
    } catch (err) {
        console.log('err: ', err)
        res.status(500).json({ message: 'Error merging file' })
    }
})
export default router
