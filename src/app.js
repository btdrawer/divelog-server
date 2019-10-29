const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const routerUrls = require('./variables/routerUrls');

const userRouter = require('./routes/user');
const diveRouter = require('./routes/dive');
const clubRouter = require('./routes/club');
const gearRouter = require('./routes/gear');
const groupRouter = require('./routes/group');

require('./db');

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(routerUrls.USER, userRouter);
app.use(routerUrls.DIVE, diveRouter);
app.use(routerUrls.CLUB, clubRouter);
app.use(routerUrls.GEAR, gearRouter);
app.use(routerUrls.GROUP, groupRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
