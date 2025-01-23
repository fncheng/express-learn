import { Request, Response, Router } from 'express'
import { sleep } from '../utils/index'

const router = Router()

/**
 * GET /test/getName
 */
router.get('/test/getName', async (req: Request, res: Response) => {
    await sleep(2000)
    res.status(200).json({ name: 'John Doe' })
})

export default router
