const express = require("express");
const cookieParser = require("cookie-parser");
const routerUrls = require("./variables/routerUrls");

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

app.use(routerUrls.USER, userRouter);
app.use(routerUrls.DIVE, diveRouter);
app.use(routerUrls.CLUB, clubRouter);
app.use(routerUrls.GEAR, gearRouter);
app.use(routerUrls.GROUP, groupRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
