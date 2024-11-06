const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.send({
        name: 'zs'
    })
})

router.get('/getName', (req, res) => {
    res.setTimeout(2000, () => {
        res.status(200).send({
            name: 'test'
        })
    })
})

router.get('/getNumber', (req, res) => {
    res.setTimeout(3000, () => {
        res.status(200).send({
            number: 9999
        })
    })
})

router.get('/getPieData', (req, res) => {
    res.setTimeout(2000, () => {
        res.status(200).send({
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ]
        })
    })
})

router.get('/err', (req, res) => {
    res.status(200).send({
        code: 404,
        data: {
            msg: 'error'
        }
    })
})
router.get('/pic', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/images/数据导入样式.xlsx'))
})

router.post('/add', (req, res) => {
    console.log('payload', req.body)
    res.send({
        code: 200,
        data: 'success'
    })
})

module.exports = router
