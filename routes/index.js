var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index', (req, res, next) => {
  res.render('index', { title: 'Something!' });
});

module.exports = router;
