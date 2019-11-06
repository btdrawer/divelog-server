const express = require("express");
const cookieParser = require("cookie-parser");
const { USER, DIVE, CLUB, GEAR, GROUP } = require("./variables/routerUrls");

const userRouter = require("./routes/user");
const diveRouter = require("./routes/dive");
const clubRouter = require("./routes/club");
const gearRouter = require("./routes/gear");
const groupRouter = require("./routes/group");

require("./db");

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(USER, userRouter);
app.use(DIVE, diveRouter);
app.use(CLUB, clubRouter);
app.use(GEAR, gearRouter);
app.use(GROUP, groupRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
