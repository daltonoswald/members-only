var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = process.env.DEV_DB_URL;
const mongoDB = process.env.DEV_DB_URL || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet.contentSecurityPolicy({
  directives: {
    "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
  }
}))

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
})
app.use(limiter);

app.use(
  session({
    secret: process.env.SECRET || SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
