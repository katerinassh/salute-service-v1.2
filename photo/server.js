const express = require('express');
const bodyParser = require('body-parser');
const { router } = require('./src/router');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use('/photo', router);

app.listen(process.env.APP_PORT, () => {
  console.log(`Photo service listening on port ${process.env.APP_PORT}!`);
});
