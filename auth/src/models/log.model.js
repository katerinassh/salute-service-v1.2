const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user_number: {
      type: Number,
      unique: true,
      required: true,
    },
    entrances: [Date],
  },
  { timestamps: true },
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
