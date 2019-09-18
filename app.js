const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/divelog', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.log('Database connection error.'));

const userRouter = require('./routes/user');
const clubRouter = require('./routes/club');
const gearRouter = require('./routes/gear');
const friendRouter = require('./routes/friend');
const messageRouter = require('./routes/message');

app.use('/users', userRouter);
app.use('/club', clubRouter);
app.use('/gear', gearRouter);
app.use('/friends', friendRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080, () => console.log("Listening on port 8080"));

module.exports = app;
