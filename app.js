var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var screenRouter = require('./routes/screen');
var orgRouter = require('./routes/org');
var stationRouter = require('./routes/station');

//同步OA 信息接口
var OASystemRouter = require('./routes/syncOAInfo');
var getArtRouter = require('./routes/getArtByPermission');
var settingsRouter = require('./routes/settings');
//获取动态路由
var getPathRouter = require('./routes/routers');

//test
var testRouter = require('./routes/syncOATest');

var app = express();
//设置跨域访问
app.all('*', function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     res.header("X-Powered-By",' 3.2.1');
     res.header("Content-Type", "application/json;charset=utf-8");
     next();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/permission', indexRouter);
app.use('/permission/users', usersRouter);
app.use('/permission/screen', screenRouter);
app.use('/permission/org', orgRouter);
app.use('/permission/station', stationRouter);

//同步OA系统人员、组织、岗位信息接口
app.use('/permission/OASystem', OASystemRouter);
app.use('/permission/getArtByPermission', getArtRouter);
app.use('/permission/settings', settingsRouter);
//获取动态路由
app.use('/permission/routes', getPathRouter);

app.use('/permission/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
