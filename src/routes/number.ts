import { Request, Response, Router } from 'express'
import { sleep } from '../utils/index'

const router = Router()

/**
 * GET /test/getNumber
 */
router.get('/test/getNumber', async (req: Request, res: Response) => {
    await sleep(200)
    res.status(200).json({ number: 999 })
})

export default router
