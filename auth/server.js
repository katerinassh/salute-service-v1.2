const express = require('express');
const bodyParser = require('body-parser');
const { router } = require('./src/router');
const { connectDb } = require('./src/models');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/auth', router);

connectDb().then(async () => {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Auth service listening on port ${process.env.APP_PORT}!`);
  });
});
