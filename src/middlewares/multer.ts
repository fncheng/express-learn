import fs from 'fs-extra'
import multer from 'multer'

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './tmp')
    },
    filename(req, file, callback) {
        console.log('file: ', file)
        const originalName = Buffer.from(file.originalname, 'latin1').toString(
            'utf8'
        )
        callback(null, originalName)
    }
})

export const upload = multer({ storage })

/**
 * 临时目录
 */
export const TMP_DIR = '../../tmp/'
export const UPLOAD_DIR = '../../uploads/'

if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR)
}
