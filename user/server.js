const express = require('express');
const bodyParser = require('body-parser');
const { userRouter } = require('./src/user.router');
const { interestRouter } = require('./src/interest.router');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/interest', interestRouter);

app.listen(process.env.APP_PORT, () => {
  console.log(`User service listening on port ${process.env.APP_PORT}!`);
});
