import { Request, Response, Router } from 'express'

const router = Router()

/**
 * GET /login
 */
router.get('/login', (req: Request, res: Response) => {
    // res.setHeader('Location', 'http://localhost:20003/vue-app/home')
    res.setHeader('Content-Type', 'text/html')
    // res.status(302).send()
    res.redirect('http://localhost:20003/vue-app/home')
})

export default router
