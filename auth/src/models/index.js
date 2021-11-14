const mongoose = require('mongoose');
const Log = require('./log.model');
require('dotenv').config({ path: '../../.env' });

const connectDb = () => mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`);

const models = { Log };

module.exports = { connectDb, models };
