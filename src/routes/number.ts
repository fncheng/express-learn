import { Request, Response, Router } from 'express'
import { sleep } from '../utils/index'

const router = Router()

/**
 * GET /test/getNumber
 */
router.get('/test/getNumber', async (req: Request, res: Response) => {
    await sleep(2000)
    res.status(200).json({ number: 999 })
})

router.get('/test/user', async (req: Request, res: Response) => {
    await sleep(500)
    res.status(200).json({
        id: req.query.id
    })
})

export default router
