var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.get('/index', (req, res, next) => {
  res.render('index', { title: 'Something!' })
})
router.get('/about', (req, res) => {
  res.send({
    name: 'zs'
  });
});

module.exports = router
