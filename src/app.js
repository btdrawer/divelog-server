const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = process.env.PORT;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./db/db');

const userRouter = require('./routes/user');
const clubRouter = require('./routes/club');
const gearRouter = require('./routes/gear');
const groupRouter = require('./routes/group');

app.use('/user', userRouter);
app.use('/club', clubRouter);
app.use('/gear', gearRouter);
app.use('/group', groupRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
