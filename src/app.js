const express = require('express');
require('./db/mongoose');
const CORS = require('cors');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(CORS());
app.use(express.json());
app.use(userRouter, taskRouter);

module.exports = app;
