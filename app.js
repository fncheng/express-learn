// 引入依赖包
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

// 引入路由文件
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var testRouter = require('./routes/test')

// 创建应用实例
var app = express();

// 设置视图目录和模板引擎
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
/* 以下皆为注册中间件 */
// 内置中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 路由中间件
app.use('/', indexRouter);
app.use('/users', require('./routes/users'));
app.use('/test', require('./routes/test.js'))

// 404错误处理中间件
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理中间件
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
