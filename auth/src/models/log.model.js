const mongoose = require('mongoose');

const EntrancesSchema = new mongoose.Schema({
  time: { type: Date, default: new Date() },
  geo: { type: [Number, Number], default: [] },
});

const logSchema = new mongoose.Schema(
  {
    user_number: {
      type: Number,
      unique: true,
      required: true,
    },
    entrances: [EntrancesSchema],
  },
  { timestamps: true },
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
